# 02 · 一个请求的完整旅程 / 从 0 到 1 / 动手复现

> 源码基于 [badlogic/pi-mono](https://github.com/badlogic/pi-mono) `main` @ `05c7a37`；演化历史来自该仓库的 7582 个提交（2025-08-09 至今）。
> 复现代码：[`mini-pi/`](./mini-pi/)，共 923 行，带端到端测试。

---

## 第一部分：一个请求的完整旅程

场景：你在 `pi` 的交互界面输入"把 README 里的拼写错误改掉"，按回车。

### 去程（从键盘到 HTTP）

```
键盘
 │ ① modes/interactive  —— 表现层：只负责收输入、画界面
 ▼
InteractiveMode  editor.onSubmit(text)
 │   · `!cmd` → 直接执行 bash；压缩中 → 排队；agent 正在跑 → prompt(text, {streamingBehavior:"steer"})
 │ ② core/agent-session —— 产品逻辑层：所有模式共用
 ▼
AgentSession.prompt(text)
 │   · `/xxx` 是扩展命令 → 直接执行，不走模型
 │   · _preparePrompt：扩展的 input 钩子 → 展开 /skill、提示词模板 → 检查模型和认证
 │   · _startRun → _prepareRun：必要时先压缩 → 扩展的 before_agent_start（可改系统提示、工具）
 │ ③ pi-agent-core      —— agent 内核
 ▼
Agent.prompt(messages)  → runWithLifecycle（建 AbortController）→ runAgentLoop → runLoop
 │   · 注入 steering 消息 → declareToolChanges（工具变化写成 system 消息）
 │   · prepareRequest 钩子（AgentSession 在这里做自动压缩、模型路由）
 │   · transformContext（扩展的 context 事件）→ convertToLlm（自定义消息 → user）
 │   · streamFn(model, transcript, options)
 │ ④ sdk.ts 里装配的 streamFn —— 胶水
 ▼
cacheWarmer.start(...) ; modelRuntime.streamSimple(...)
 │ ⑤ pi-ai              —— 模型接入层
 ▼
Models.streamSimple  → normalizeContext → applyAuth（取 key / OAuth）→ provider.streamSimple
 ▼
api/anthropic-messages.ts  stream()
     · convertMessages / convertTools：统一格式 → Anthropic 线格式
     · 加 cache_control、thinking 参数、beta 头
     · 发 HTTP 请求，拿到 SSE 流
```

### 回程（从 SSE 到屏幕和磁盘）

```
Anthropic SSE: message_start / content_block_delta / message_delta / message_stop
 │ ⑤ iterateAnthropicEvents 逐个翻译
 ▼
AssistantMessageEventStream.push({type:"text_delta", partial}) …… push({type:"done"})
 │   · stop_reason 映射：end_turn→stop, max_tokens→length, tool_use→toolUse, refusal→error
 │   · 任何异常 → push({type:"error"})，绝不往上抛
 │ ③ streamAssistantResponse: for await 消费
 ▼
emit(message_start / message_update* / message_end)
 │   · stopReason=toolUse → executeToolCalls：校验 → beforeToolCall → execute → afterToolCall
 │     （edit 工具执行时走 file-mutation-queue，同一文件串行）
 │   · 工具结果 push 进 context → 回到循环顶部，再请求一次模型（第二次 HTTP）
 │   · 直到模型不再调用工具 → turn_end → 检查 steer/followUp → agent_end
 ▼
Agent.processEvents：更新 state（streamingMessage / messages / pendingToolCalls）→ 依次 await 监听者
 │ ②
 ▼
AgentSession._handleAgentEvent
 │   · 转发给扩展（message_end / tool_execution_* 等事件）
 │   · message_end → sessionManager.appendMessage() 追加一行到 .jsonl
 │   · agent_end 后 _handlePostAgentRun：失败自动重试？上下文溢出要压缩后继续？
 │ ①
 ▼
InteractiveMode 订阅 session 事件 → 更新组件 → pi-tui 差量重绘终端
```

### 关键代码位置

| 步骤 | 文件:行 | 看点 |
|---|---|---|
| ① 收输入 | `coding-agent/src/modes/interactive/interactive-mode.ts:3315` | 正在运行时输入会变成 steer |
| ② 入口 | `coding-agent/src/core/agent-session.ts:2137` `prompt()` | 扩展命令、模板展开、认证检查 |
| ② 开始一次 run | `agent-session.ts:1918` `_startRun()` | `agent.prompt()` 之后的 while：重试、溢出恢复都在这 |
| ② 请求前钩子 | `agent-session.ts:823` `_installAgentRequestProjection` | 超阈值时在这里自动压缩 |
| ③ 内核循环 | `agent/src/agent-loop.ts:172` `runLoop()` | 双层 while |
| ③ 流式消费 | `agent-loop.ts:390` | partial 原地替换 |
| ④ 装配 | `coding-agent/src/core/sdk.ts:403` | `new Agent({...streamFn...})` |
| ⑤ 分发 | `ai/src/models.ts:930` `Models.streamSimple` | 认证 + 找 provider |
| ⑤ 协议实现 | `ai/src/api/anthropic-messages.ts:806` | SSE → 统一事件 |
| ⑤ 停止原因 | `anthropic-messages.ts:1935` `mapStopReason` | 各家的值不同，统一成 5 种 |
| ② 落盘 | `agent-session.ts:1205` | 每条 message_end 追加一行 |

### 这条链路说明了什么

- **每层只跟相邻层说话。** 交互界面不知道 HTTP，内核不知道 `.jsonl` 文件，pi-ai 不知道什么是"一个回合"。
- **往下传的是函数，往上传的是事件。** 上层通过钩子（`prepareRequest`、`beforeToolCall`、`streamFn`……）把行为注入下层；下层只发事件，不回调上层的具体逻辑。
- **一个用户请求 ≠ 一次 HTTP。** 上面这个例子至少两次 HTTP（第一次模型说"我要调 edit"，第二次拿到工具结果后总结），可能更多。

---

## 第二部分：从 0 到 1 是怎么长出来的

下面先列**提交历史里的事实**，再说**从中推出来的规律**。

### 时间线（来自 git log）

| 时间 | 发生了什么 | 代表性提交 |
|---|---|---|
| 2025-08-09 | 建 monorepo（npm workspaces）。当时的 `packages/agent` 是一个**早期的 CLI agent**，不是今天的内核 | "Initial monorepo setup…" |
| 2025-08-10 | **先做 TUI**：差量渲染、保留滚动缓冲 | "tui-double-buffer: Implement smart differential rendering" |
| 2025-08-17 | **新建 pi-ai**：统一 OpenAI / Anthropic / Gemini | "feat(ai): Create unified AI package…" |
| 08-24 ~ 08-30 | 补 OpenAI Completions + Responses、Gemini；接 models.dev 生成模型目录；加成本统计 | "Add models.generated.ts with 181 tool-capable models" |
| 2025-09-09 | **agent 循环最早写在 pi-ai 里**（`packages/ai/src/agent/`），工具参数用 Zod 校验 | "Implement Zod-based tool validation and improve Agent API" |
| 2025-09-15 | streamFn 变成可配置 —— 这是后来"内核不依赖具体模型实现"的起点 | "Make stream function configurable in agent" |
| 2025-09-16 | Zod 换成 TypeBox；流式工具调用支持部分 JSON 解析 | "Replace Zod with TypeBox…" |
| 2025-10 上旬 | 做**浏览器扩展 + web-ui**：自定义消息类型、会话存储、代理包 | "Add custom message extension system with typed renderers and message transformer" |
| 2025-10-17 | 新的 `packages/agent`（Agent 类）+ **coding agent 开工**；旧 agent 改名 agent-old | "Agent package + coding agent WIP" |
| 2025-11-11 ~ 12 | coding-agent 成形：read/write/edit/bash、会话恢复、模型选择、导出 HTML；改名 pi-coding-agent | "Add --resume flag with session selector" |
| 2025-11-21 | pi-agent 改名 pi-agent-core | "rename pi-agent to pi-agent-core" |
| 2025-11-29 | 加只读工具 grep / find / ls | |
| 2025-12-02 | **先写压缩的调研和方案文档**，再实现自动压缩 | "Add compaction research and implementation plan" |
| 2025-12-08 ~ 09 | **抽出 AgentSession**（提交里按工作包 WP4/WP5/WP6 推进）；加 hooks 系统 | "WP4: Add AgentSession prompting methods" |
| 2025-12-20 | steer：排队消息可以打断工具批次（仍在 `ai/src/agent/agent-loop.ts`） | "interrupt tool batch on queued messages" |
| 2025-12-22 | SDK：`createAgentSession` 供程序调用，main.ts 改为走 SDK | "Add SDK for programmatic AgentSession usage" |
| 2025-12-28 | **agent 循环从 pi-ai 搬到 pi-agent-core**，pi-ai 的 README 删掉 agent 章节 | "Add CHANGELOG entry for agent API move to pi-agent-core" |
| 2026-01-05 | hooks 和 custom tools 合并成统一的**扩展系统** | "Merge hooks and custom-tools into unified extensions system" |
| 2026-08 起 | Chord（对象运行时），之后是 pi-durable（持久化 agent） | "feat: add Chord runtime foundation" |

### 从历史推出的规律

> 以下是推断，不是作者原话。

1. **先做最难统一、最底层的部分。** 各家模型 API 差异最大（消息格式、工具调用格式、思考内容、停止原因、缓存），所以 pi-ai 最先做，而且一开始就同时接三家，逼出真正通用的抽象。
2. **先写在一起，有第二个使用者时再拆。** agent 循环最早就是 pi-ai 里的一个子目录。等 web-ui 和 coding-agent 两个产品都要用、需求开始分化时，才搬到独立的 pi-agent-core。不要一开始就为想象中的复用拆包。
3. **抽象来自真实产品的需求。**
   - `AgentMessage` + `convertToLlm`：web-ui 需要"导航消息""artifact 消息"这些不该直接发给模型的自定义消息 → 才有了"应用消息 ≠ LLM 消息"的分离。
   - `AgentSession`：交互、print、RPC 三种模式都要重复"落盘、重试、压缩"→ 才抽出所有模式共用的一层。
   - 扩展系统：hooks 和 custom tools 各自长出来以后发现是同一件事 → 才合并。
4. **复杂功能先写方案再动手。** 压缩先提交了调研文档，AgentSession 按工作包推进。
5. **契约一旦定下就很稳。** "streamFn 不抛异常""工具错误回给模型""事件序列完整"这些规则早期就有，后面的重构都没碰它们。

### 如果按架构从上往下设计，顺序应该是

1. **先定数据**：统一的消息类型（user / assistant / toolResult）、内容块（text / thinking / toolCall）、停止原因。
2. **再定协议**：模型流式事件（`start → *_delta → done | error`）和 agent 事件（`agent_* / turn_* / message_* / tool_execution_*`）。
3. **再定契约**：谁可以抛异常（只有工具的 execute）、谁不可以（streamFn、钩子）；错误怎么表示。
4. **再写循环**：只依赖上面三样，用假模型测试。
5. **最后接真实世界**：真实 provider、工具、持久化、UI —— 都是插到循环上的东西。

---

## 第三部分：自己复现一个简单版本

### 代码结构（和 pi 一一对应）

```
mini-pi/                         对应 pi 的
├── ai.ts          253 行   L1   packages/ai           统一类型 + EventStream + openai-completions 协议 + faux 假模型
├── agent.ts       271 行   L2   packages/agent        runAgentLoop（双层 while）+ Agent 类（队列、订阅、中止）
├── tools.ts        95 行   L3   core/tools/           read / write / edit / bash + 同文件写锁
├── session.ts      49 行   L3   core/session-manager  jsonl，id/parentId 树
├── app.ts          52 行   L3   core/sdk + agent-session + system-prompt  装配 + 落盘订阅 + bash 确认
├── main.ts         65 行   L3   cli.ts / main.ts / modes/   print 模式 + 交互模式
├── mock-openai-server.ts        测试用：本地模拟 OpenAI 流式接口
└── e2e.test.ts                  端到端测试
```

依赖方向：`main → app → (agent, tools, session) → ai`，`agent.ts` 只 import `ai.ts`。

### 运行

```bash
cd notes/pi-agent/mini-pi
```

无 API key，用假模型（它会调一次 bash 列目录）：

```bash
node --experimental-strip-types main.ts -p "看看目录"
```

用任意 OpenAI 兼容服务（OpenAI / DeepSeek / Ollama / vLLM…）：

```bash
MINI_PI_BASE_URL=https://api.deepseek.com/v1 MINI_PI_API_KEY=sk-xxx MINI_PI_MODEL=deepseek-chat node --experimental-strip-types main.ts
```

端到端测试（不需要 key，用本地 mock 服务器走真实 HTTP + SSE）：

```bash
node --experimental-strip-types --test e2e.test.ts
```

测试覆盖三件事：
1. 一个请求触发两次 HTTP、一次工具调用，事件顺序正确，第二次请求的线格式正确（`system, user, assistant(tool_calls), tool`），会话落盘 4 行且能恢复。
2. 工具执行时 `steer()` 的消息和工具结果在同一轮发出；`followUp()` 的消息在 agent 本该停下时才发出。
3. 连不上服务器时不抛异常，得到 `stopReason: "error"` 的消息。

### 推荐的动手顺序（每一步都能独立运行）

| 步骤 | 写什么 | 怎么验证 | 对应 pi 的哪个阶段 |
|---|---|---|---|
| 1 | `ai.ts` 的类型 + `EventStream` + faux 模型 | for await 打印事件 | pi-ai 的类型和 event-stream |
| 2 | `agent.ts` 的 `runAgentLoop`（先只支持顺序执行工具） | 用 faux 模型 + 一个计算器工具跑通 | 2025-09 写在 pi-ai 里的 agent |
| 3 | 接一个真实协议（OpenAI 兼容的最简单） | mock 服务器 + 一次真实调用 | pi-ai 的 api/openai-completions |
| 4 | 四个工具 | 让模型读一个文件、改一行 | coding-agent 的 core/tools |
| 5 | 会话 jsonl + 恢复 | 退出后重新打开，历史还在 | session-manager |
| 6 | Agent 类：订阅、steer、followUp、abort | e2e 测试第 2 条 | agent.ts |
| 7 | CLI：print 模式 + 交互模式 | 实际用它改代码 | modes/ |

### 刻意没做的（下一步可以加的）

按难度从低到高：

- **工具参数完整校验**：现在只查必填字段；可以接 ajv 或 TypeBox。
- **`afterToolCall` 钩子**：改写工具结果（例如截断、脱敏）。
- **Anthropic 协议**：第二个协议能验证 `ai.ts` 的抽象够不够用（思考内容、cache_control、不同的工具调用格式）。
- **上下文压缩**：`chars/4` 估 token → 超过 `contextWindow - reserve` 时把旧消息交给模型总结成一条摘要消息 → 用 `prepareRequest` 钩子挂进循环。
- **自定义消息 + convertToLlm**：例如把 `!ls` 的输出记成 `bashExecution` 消息，发给模型前转成 user 消息。
- **扩展系统**：把 `beforeToolCall` / 事件订阅暴露成 `on("tool_call", ...)` 这样的 API，从目录里加载 .ts 文件。
- **工具声明写进 transcript**：工具增减作为 system 消息记录，会话就能完整回放。

### 写的过程中踩到的一个坑（真实发生的）

第一版 `main.ts` 渲染时用 `e.message.content.at(-1)?.type === "text"` 判断当前增量是不是文字，结果 mock 服务器返回的第一句"我来运行一下。"没显示出来。

原因：`partial` 是生产者（SSE 解析）持续修改的**同一个对象**。生产者比消费者快，消费者处理第一个 `text_delta` 时，`partial.content` 末尾已经被追加了 toolCall。修复方法是让事件自己带上增量类型（`kind: "text" | "toolcall"`），不去读 partial 的"当前末尾"。

pi 的事件里每个增量都带 `contentIndex`，也是同样的道理：**增量要能自己说清楚自己是什么，不依赖读取时共享状态的样子。**
