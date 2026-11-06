# pi-agent 源码学习笔记

> 源码：[badlogic/pi-mono](https://github.com/badlogic/pi-mono)（npm 包名 `@earendil-works/pi-*`）
> 阅读版本：`main` @ `05c7a37`（2026-11-06），`pi-agent-core` v1.5.0
> 下一篇：[01 · 顶层架构：分层、文件夹与命名](./01-architecture.md)
>
> 配套代码：[`mini-agent-loop.ts`](./mini-agent-loop.ts) —— 按同样结构手写的 150 行迷你版，无需 API key 可直接运行：
>
> ```bash
> node --experimental-strip-types notes/pi-agent/mini-agent-loop.ts
> ```

---

## 0. 一句话概括

**pi = 一个极简的 agent 内核（`pi-agent-core`，约 2.5k 行）+ 一个统一的多厂商 LLM 流式接口（`pi-ai`）+ 一个在内核上层层加 hook 的编码 agent（`pi-coding-agent`）。**

内核只做一件事：「调 LLM → 执行工具 → 把结果塞回上下文 → 再调 LLM」，并在每一步发出事件。其余的所有功能（压缩、扩展、权限、会话树、模型切换……）都通过内核预留的**回调钩子**注入，而不是写进循环本身。

---

## 1. Monorepo 结构与阅读顺序

| 包 | 规模 (src 行数) | 作用 | 建议 |
|---|---|---|---|
| `packages/agent` (`pi-agent-core`) | ~2.5k | **agent 循环 + 有状态 Agent 类** | ⭐ 必读，逐行读 |
| `packages/ai` (`pi-ai`) | ~29k | 统一 LLM API：Anthropic/OpenAI/Google/Bedrock…，流式事件协议 | 读 `types.ts` 与 `utils/event-stream.ts`，provider 实现挑一个看 |
| `packages/coding-agent` | ~78k | `pi` CLI：工具、会话、压缩、扩展、TUI/RPC 模式 | 读 `core/sdk.ts`、`core/agent-session.ts`、`core/tools/*`、`core/compaction/*` |
| `packages/tui` | ~20k | 差量渲染终端 UI 库 | 可选 |
| `packages/mcp` / `codemode` / `durable` / `schema` … | — | MCP 客户端、沙盒 JS、持久化运行时、无 eval 的 JSON Schema 校验 | 可选 |

推荐顺序：

1. `agent/src/types.ts` —— 先看懂类型和钩子的契约（注释写得非常好）
2. `agent/src/agent-loop.ts` —— 核心循环
3. `agent/src/agent.ts` —— 有状态封装、队列、事件 reducer
4. `ai/src/types.ts` + `ai/src/utils/event-stream.ts` —— 流式协议
5. `coding-agent/src/core/sdk.ts` → `agent-session.ts` —— 看真实产品如何「插」进内核

---

## 2. agent-core 的分层

```
┌────────────────────────────────────────────────────────────┐
│ Agent (agent.ts)                                           │
│  - 持有 state：messages / tools / model / thinkingLevel     │
│  - steeringQueue / followUpQueue                           │
│  - subscribe(listener)、prompt()、continue()、abort()       │
│  - processEvents()：事件 → 更新 state → 依次 await 监听者     │
└──────────────┬─────────────────────────────────────────────┘
               │ createLoopConfig() 把自身字段/队列打包成 config
┌──────────────▼─────────────────────────────────────────────┐
│ runAgentLoop / runLoop (agent-loop.ts)    —— 无状态纯流程      │
│  - 双层 while                                               │
│  - streamAssistantResponse()  ← StreamFn（由宿主注入）        │
│  - executeToolCalls()  sequential / parallel                │
└──────────────┬─────────────────────────────────────────────┘
               │ StreamFn(model, TranscriptContext, options)
┌──────────────▼─────────────────────────────────────────────┐
│ pi-ai：AssistantMessageEventStream（start/text_delta/        │
│        toolcall_delta/.../done|error）                       │
└────────────────────────────────────────────────────────────┘
```

关键设计：**`agent-loop.ts` 是无状态的**，所有状态都在调用者传入的 `context` 和 `config` 里；`Agent` 类只是「把状态和队列包起来 + 把事件 reduce 回 state」。这让你既可以直接用底层 `agentLoop()`（返回一个 `EventStream`，可 `for await`），也可以用高层 `Agent`。

---

## 3. 核心循环 `runLoop`（agent-loop.ts:172）

把源码去掉细节，结构就是：

```ts
let pending = await config.getSteeringMessages?.() ?? [];

while (true) {                                   // 外层：follow-up 循环
  let hasMoreToolCalls = true;
  while (hasMoreToolCalls || pending.length > 0) {   // 内层：一次迭代 = 一个 turn
    if (lastCompletedTurn) {
      await config.prepareNextTurn?.(lastCompletedTurn);   // 可替换 context/model/thinking
      emit("turn_start");
    }
    注入 pending 消息（emit message_start/end，push 进 context）
    await config.prepareRequest?.(...)            // 每次请求前最后一次改 context/model 的机会

    const message = await streamAssistantResponse(...);
    if (message.stopReason === "error" || "aborted") { finishTurn; turn_end; agent_end; return; }

    toolCalls = message.content.filter(c => c.type === "toolCall");
    if (toolCalls.length) {
      batch = message.stopReason === "length"
        ? failToolCallsFromTruncatedMessage()     // 输出被截断 → 所有工具调用直接判错
        : executeToolCalls();
      hasMoreToolCalls = !batch.terminate;
    }

    decision = await config.finishTurn?.(turn);   // 可 {action:"end"} 强制结束
    emit("turn_end");
    pending = await config.getSteeringMessages?.();
  }
  followUps = await config.getFollowUpMessages?.();
  if (followUps.length) { pending = followUps; continue; }
  if (explicitContinuation) continue;             // finishTurn 返回 {action:"continue"}
  break;
}
emit("agent_end");
```

### 要点

1. **「turn」的定义**：一次 assistant 回复 + 它触发的所有工具执行。只要还有工具结果（或有 steering 消息）就继续下一轮。
2. **何时停止**：assistant 不再调工具、没有 steering、没有 follow-up、`finishTurn` 没要求继续。
3. **错误不是异常**：`StreamFn` 的契约是「不许 throw」，失败必须编码成 `stopReason: "error" | "aborted"` 的最终消息。循环遇到它就干净地发完 `turn_end` / `agent_end` 再退出，UI 永远拿到完整事件序列。
4. **`stopReason === "length"` 的防御**（agent-loop.ts:276）：输出 token 用尽时，工具参数是被「尽力修复」的 JSON，可能看似合法但内容不全。pi 选择一律不执行，返回错误让模型重发——这是很值得借鉴的工程细节。
5. **Steering vs Follow-up**：
   - `steer(msg)`：agent 干活时用户插话，**在当前 turn 的工具都执行完后**注入（不会跳过已发出的工具调用）。
   - `followUp(msg)`：等 agent **本来要停下时**才注入，开启新一轮。
   - 两个队列都支持 `QueueMode`：`"all"` 一次全取 / `"one-at-a-time"` 每个排水点只取一条（默认）。

### 五个钩子在一个 turn 中的位置

```
turn_start
  ├─ prepareNextTurn(lastTurn)      (非首轮) 例：压缩后替换 context
  ├─ 注入 steering/follow-up 消息
  ├─ prepareRequest({context, model, thinkingLevel})   例：路由到其它模型
  ├─ transformContext(messages)     AgentMessage[] → AgentMessage[]（裁剪/注入）
  ├─ convertToLlm(messages)         AgentMessage[] → Message[]（自定义消息 → user）
  ├─ getApiKey(provider)            每次请求动态取 key（OAuth token 会过期）
  ├─ streamFn(...)                  → message_start / message_update* / message_end
  ├─ 每个工具调用：
  │    prepareArguments → validateToolArguments(schema) → beforeToolCall(可 block)
  │    → tool.execute(id, args, signal, onUpdate) → afterToolCall(可改写结果)
  ├─ finishTurn(turn)               可 end / continue
turn_end
  └─ getSteeringMessages()
```

---

## 4. 流式响应：`streamAssistantResponse`（agent-loop.ts:390）

- `start` 事件时把 `partial` 消息 **push 进 context**；之后每个 `*_delta` 事件**原地替换** `context.messages` 的最后一项，并发 `message_update`。
- `done` / `error` 时用 `response.result()` 拿最终消息替换 partial，发 `message_end`。
- 发出去的消息是 `{ ...partialMessage }` 浅拷贝，防止监听者拿到后被后续 delta 改掉。

底层的 `EventStream<T, R>`（`ai/src/utils/event-stream.ts`）是一个很小巧的「推模型 → 拉模型」适配器：

- `push(event)`：有等待中的消费者就直接 resolve，否则入队；
- `[Symbol.asyncIterator]`：队列有货就 yield，没有就挂一个 Promise 等；
- `isComplete(event)` 判断终止事件，`result()` 返回最终结果 Promise。
- 内部 `FifoQueue` 用两个栈实现 O(1) 均摊出队。

`AssistantMessageEvent` 协议（`ai/src/types.ts:831`）：
`start → (text|thinking|toolcall)_(start|delta|end)* → done | error`，每个事件都带 `partial`（当前累计的完整消息），消费者不需要自己拼。

---

## 5. 工具执行（agent-loop.ts:518 起）

### 准备阶段 `prepareToolCall`
1. 找不到工具 → 立即返回错误结果 `Tool X not found`
2. `tool.prepareArguments?.(raw)` —— 兼容层，修正模型给的旧格式参数
3. `validateToolArguments(tool, call)` —— 用 JSON Schema 校验（pi-schema，无 eval）
4. `beforeToolCall` —— 返回 `{ block: true, reason }` 可拦截（coding-agent 的扩展权限检查就在这）
5. 任一步抛异常都被 catch 成 **错误工具结果**，回给模型，而不是让循环崩掉

### 执行阶段
- **parallel（默认）**：*准备*是按顺序做的（保证 `beforeToolCall` 的权限弹窗等串行），*执行*用 `Promise.all` 并发；`tool_execution_end` 按完成顺序发，但 `toolResult` 消息按 **assistant 原始顺序** 发出和入上下文（保证 provider 要求的配对顺序）。
- **sequential**：全局配置为 sequential，或这批里**任何一个**工具声明 `executionMode: "sequential"`，整批就退化成顺序执行。
- `onUpdate` 回调用于流式部分结果（比如 bash 的实时输出）→ `tool_execution_update` 事件；工具 Promise 结束后再调 `onUpdate` 会被忽略（`acceptingUpdates` 标志）。
- `terminate`：只有当**整批所有**工具结果都设了 `terminate: true` 时才提前结束，避免一个工具单方面终止。

### `runToolCall`（agent-loop.ts:821）
导出给「工具内部调用其它工具」用（例如 codemode 沙盒里调 read/bash），走同样的校验和 before/after 钩子，所以权限检查对嵌套调用同样生效。

---

## 6. 有状态封装 `Agent`（agent.ts）

- **state**：`messages` / `tools` 用 getter/setter，赋值时会 `slice()` 拷贝顶层数组；`systemPrompt` 是只读的，由 transcript 里的 system 消息**回放**得到。
- **事件 reducer** `processEvents`：
  - `message_start/update` → `streamingMessage = msg`
  - `message_end` → push 到 `state.messages`
  - `tool_execution_start/end` → 维护 `pendingToolCalls`（每次新建 Set，方便 UI 做引用比较）
  - 然后**按订阅顺序依次 await** 每个监听者 —— 监听者是 run 的一部分，`agent_end` 的监听者跑完 agent 才算 idle（`waitForIdle()`）。
- **运行生命周期** `runWithLifecycle`：同一时间只允许一个 run；外层 try/catch 把意外异常也包装成一条 `stopReason: "error"` 的 assistant 消息并补发完整事件序列。
- `prompt()` 在运行中调用会直接 throw，提示你改用 `steer()` / `followUp()`。
- `continue()`：最后一条是 `user`/`toolResult` 时直接继续（用于重试）；如果最后是 assistant，就先尝试排空队列。

---

## 7. 一个巧妙的设计：System Prompt 和工具声明都在 transcript 里

`pi-ai` 的 `SystemMessage` 不只是 prompt 文本，它还有：

```ts
interface SystemMessage {
  role: "system";
  content: string | TextContent[];
  sections?: Record<string, string | null>; // 按名字替换/删除 prompt 片段
  toolsAdded?: Tool[];                       // 从这里开始可用的工具
  toolsRemoved?: ToolReference[];            // 从这里开始不可用的工具
}
```

- 对话中途切换工具/改 prompt，不是改一个全局变量，而是**在 transcript 里追加一条 system 消息**记录增量。
- `declareToolChanges()`（agent-loop.ts:342）在每次请求前比较「transcript 回放出的工具集」和「`context.tools` 实际可执行的工具集」，有差异就自动插入一条带 `toolsAdded/toolsRemoved` 的 system 消息。
- 好处：会话可完全回放、可分叉、对 prompt cache 友好（前缀不变，只在尾部追加增量）。

---

## 8. coding-agent 如何使用内核

### 8.1 组装（`coding-agent/src/core/sdk.ts:403`）

```ts
const agent = new Agent({
  initialState: { systemPrompt: "", model, thinkingLevel, tools: [], messages: existingSession.messages },
  convertToLlm: convertToLlmWithBlockImages,
  streamFn: (model, ctx, opts) => { cacheWarmer.start(...); return modelRuntime.streamSimple(model, ctx, opts); },
  transformContext: (messages) => extensionRunner.emitContext(messages),   // 扩展可改上下文
  steeringMode, followUpMode, transport, thinkingBudgets, ...
});
const session = new AgentSession({ agent, sessionManager, settingsManager, ... });
```

然后 `AgentSession` 再往 agent 上**层层包装**钩子（保留 previous 再调用，类似中间件）：

| 钩子 | coding-agent 里做了什么 | 位置 |
|---|---|---|
| `beforeToolCall` | 触发扩展的 `tool_call` 事件，可拦截（权限、审计） | `agent-session.ts:694` |
| `afterToolCall` | 触发扩展的 `tool_result` 事件 + 图片自动缩放 | `agent-session.ts:720` |
| `prepareRequest` | 模型路由、超阈值时**自动压缩** | `agent-session.ts:812-860` |
| `finishTurn` / `prepareNextTurnWithContext` | 回合结束处理、下一轮前的准备 | `agent-session.ts:923-940` |
| `transformContext` | 扩展的 `context` 事件 | `sdk.ts:428` |

### 8.2 自定义消息类型（`core/messages.ts`）

通过 TypeScript 声明合并扩展 `CustomAgentMessages`，新增 `bashExecution`、`custom`、`branchSummary`、`compactionSummary` 等角色；`convertToLlm` 把它们统统转成 `user` 消息（或过滤掉），LLM 永远只看到四种标准角色。

### 8.3 内置工具（`core/tools/`）

默认四件套 `read / bash / edit / write`，另有 `grep / find / ls`。都是 `AgentTool`：`name + description + parameters(TypeBox schema) + execute()`。
值得看的细节：`file-mutation-queue.ts` —— 用 `realpath` 作 key 的 Promise 链，**同一文件的 edit/write 串行，不同文件并行**，配合内核默认的 parallel 工具执行。

### 8.4 会话（`core/session-manager.ts`）

- 存成 `~/.pi/agent/sessions/<按 cwd 分目录>/<timestamp>_<id>.jsonl`，每行一个 entry；
- 每个 entry 有 `id` + `parentId`，构成**树**（支持 `/tree` 回到任意节点分叉）；
- 当前对话 = 从 leaf 沿 parentId 回溯到根的路径（`buildSessionProjection`）。

### 8.5 上下文压缩（`core/compaction/compaction.ts`）

- 触发：`contextTokens > contextWindow - reserveTokens`（`shouldCompact`），或 provider 返回上下文溢出错误后的恢复。
- token 估算：有上一次 usage 就用真实值 + 之后消息的 `chars/4` 估算（保守高估）。
- `findCutPoint`：从最新往前累计，保留 `keepRecentTokens` 的近期消息，只在合法切点切（不拆开工具调用和结果），必要时允许切在 turn 中间。
- 被切掉的部分用 LLM 总结成 `compactionSummary` 消息，同时记录读过/改过的文件列表。

### 8.6 扩展系统

扩展通过 `pi.on("<event>", handler)` 挂到几十个事件上：`tool_call`、`tool_result`、`context`、`turn_start/end`、`message_*`、`session_compact`、`input`、`model_select`… 基本是把内核钩子和 AgentEvent 一对一暴露出来。pi 刻意**不内置** sub-agent、plan mode，而是让用户用扩展自己实现。

---

## 9. 值得借鉴的设计原则

1. **内核无状态 + 钩子注入**：循环只管流程，所有策略（压缩、权限、路由）通过回调注入。新增功能不改循环。
2. **错误即数据**：StreamFn 不抛异常；工具错误变成 `isError` 的 toolResult 回给模型自我修正；事件序列永远完整。
3. **AgentMessage ≠ LLM Message**：应用层消息可以任意扩展，在 LLM 边界处才 `convertToLlm`。
4. **一切写进 transcript**：system prompt、工具增减都是消息，会话可回放、可分叉、cache 友好。
5. **并发但有序**：工具并发执行，但结果按原始顺序入上下文；同文件写入串行。
6. **事件驱动 UI**：TUI、RPC、JSON print 模式都只是 `agent.subscribe()` 的不同消费者。

---

## 10. 练习建议

- [ ] 运行 [`mini-agent-loop.ts`](./mini-agent-loop.ts)，对照第 3 节的伪代码看事件顺序
- [ ] 给迷你版加 `steer()`：在工具执行时往 steering 队列塞一条消息，观察它在哪个 turn 被注入
- [ ] 给迷你版加 `beforeToolCall`，实现「执行 bash 前需要确认」
- [ ] 读 `agent/test/agent-loop.test.ts`，里面用假 StreamFn 覆盖了大量边界情况，是最好的「行为文档」
- [ ] 挑 `ai/src/api/anthropic-messages.ts`，看 provider 的 SSE 是如何翻译成 `AssistantMessageEvent` 的
- [ ] 读 `coding-agent/docs/extensions.md`，写一个最小扩展（例如拦截 `rm -rf`）
