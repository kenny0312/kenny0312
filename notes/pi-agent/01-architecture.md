# 01 · 顶层架构：分层、文件夹与命名

> 基于 [badlogic/pi-mono](https://github.com/badlogic/pi-mono) `main` @ `05c7a37`。
> 依赖关系取自各包 `package.json` 的 `dependencies`，不是推测。

## 1. 仓库根目录

```
pi-mono/
├── packages/     可复用的库，每个都发布为 npm 包 @earendil-works/*
├── apps/         应用（目前只有 p2：实验性 Web UI 原型，README 写明"很快会删掉"）
├── scripts/      整个仓库共用的构建/检查/发布脚本（check-*.mjs、build-*.sh、release…）
├── nix/          Nix 打包（package.nix + 固定版本的模型目录 model-catalog.json）
├── AGENTS.md     给 AI 编码助手看的开发规则（代码风格、命令、git 规范）
├── package.json  npm workspaces 根，"build" 脚本按依赖顺序逐个构建
└── test.sh / pi-test.*   本地测试入口
```

`packages/` 和 `apps/` 的区别就是"库 vs 产品"：`packages/*` 都发布到 npm，可以单独被别人引用；`apps/*` 是组装这些库的最终应用。注意 `pi` 命令行本身在 `packages/coding-agent` 里（它也是一个 npm 包，同时导出 SDK）。

## 2. 包的分层（按真实依赖画出）

```
                 ┌────────────────────── 栈 A：pi CLI（稳定）──────────────────────┐
  L3 产品        │  pi-coding-agent  ──┬── pi-tui      （终端 UI）                  │
                 │       │             ├── pi-mcp      （MCP 客户端）                │
                 │       │             └── pi-codemode （沙盒 JS 执行）              │
  L2 agent 内核  │  pi-agent-core                                                   │
                 │       │                                                          │
  L1 模型接入    │  pi-ai  ◄──────────────────────────────┐                         │
                 └───────┼────────────────────────────────┼─────────────────────────┘
                         │          ┌──── 栈 B：持久化运行时（实验）────┐
                         │          │  apps/p2 （Web UI 原型）         │
                         │          │  pi-env   （SSH 远程执行环境）    │
                         │          │  pi-durable（可崩溃恢复的 agent） ┘
                         │          │  chord     （跨进程对象运行时）
  L0 基础        pi-schema（无 eval 的 JSON Schema）   pi-telemetry（遥测契约）
```

| 包（文件夹） | 内部依赖 | 代表什么 |
|---|---|---|
| `schema` → pi-schema | 无 | JSON Schema 校验，编译成普通闭包（不用 `eval`，可在受限环境跑） |
| `telemetry` → pi-telemetry | 无 | 与厂商无关的遥测接口 |
| `ai` → pi-ai | schema, telemetry | **模型接入层**：把几十家厂商统一成一个流式接口 + 模型目录 + 认证 |
| `agent` → pi-agent-core | ai, schema | **agent 内核**：循环、工具执行、事件、steer/follow-up 队列 |
| `tui` → pi-tui | 无 | 差量渲染的终端 UI 库，和 agent 完全无关 |
| `mcp` → pi-mcp | 无 | 独立的 MCP 客户端 |
| `codemode` → pi-codemode | 无 | 沙盒 JS：脚本里唯一能做的事就是调用注入的工具 |
| `coding-agent` → pi-coding-agent | agent-core, ai, tui, mcp, codemode | **产品层**：`pi` CLI + SDK |
| `chord` | schema, telemetry | 通用"对象运行时"：跨进程对象、文档存储、插件热重载 |
| `durable` → pi-durable | chord, ai, codemode… | 持久化 agent：每一步先写存储再显示，进程崩了能接着跑 |
| `env` → pi-env | chord, durable | 通过 SSH 部署的远程执行守护进程 |
| `evals` → pi-evals | 无 | 评测 |

几点观察：

1. **依赖只往下走**。`agent-core` 不知道 TUI、文件系统、会话文件的存在；`ai` 不知道 agent。
2. **工具库是"叶子"**：`tui / mcp / codemode / schema / telemetry` 内部依赖为零，说明它们被刻意设计成可以单独拿走用。
3. **有两条栈**。`pi-durable` 直接用 `pi-ai`，**没有用 `pi-agent-core`**——它自己实现了一套"先落盘"的 agent 运行时，用 `chord` 管状态。这是新方向的实验，学习时可以先跳过，先吃透栈 A。
4. 根 `package.json` 的 `build` 脚本顺序（telemetry → schema → chord → tui → codemode → mcp → ai → durable → env → agent → coding-agent）就是这张图的拓扑排序。

## 3. 文件夹名与包名

| 文件夹 | npm 包名 | 说明 |
|---|---|---|
| `packages/agent` | `pi-agent-core` | 文件夹省掉 `pi-`；包名加 `-core`，强调它是内核 |
| `packages/ai` | `pi-ai` | |
| `packages/coding-agent` | `pi-coding-agent` | "coding" 说明它是 agent 内核的**一种**应用，内核本身不限于写代码 |
| `packages/chord` | `chord`（无 `pi-` 前缀） | 前缀的有无说明定位：chord 是通用框架，不是 pi 专属 |

规则：文件夹名 = 包名去掉 `@earendil-works/pi-`。

## 4. pi-ai 内部（`packages/ai/`）

```
ai/
├── catalog/        模型目录的"源"：定义 + 生成脚本（generate.ts）
├── src/
│   ├── api/        线协议实现：anthropic-messages、openai-completions、openai-responses、
│   │               google-generative-ai、bedrock-converse-stream、mistral-conversations…
│   ├── providers/  厂商：groq、deepseek、anthropic、github-copilot…（+ faux 假厂商用于测试）
│   ├── auth/       API key / OAuth / 凭据存储
│   ├── utils/      event-stream 等基础设施
│   ├── types.ts    消息、事件、模型等所有核心类型
│   └── models.generated.ts   生成文件，禁止手改
```

最值得注意的是 **`api/` 和 `providers/` 分开**：

- `api/` 按**协议**命名（`anthropic-messages`、`openai-completions`），而不是按公司命名。一种协议可以服务多家厂商。
- `providers/` 一个厂商就是：baseUrl + 认证方式 + 用哪个 api + 模型列表。例如 `providers/groq.ts`：

  ```ts
  baseUrl: "https://api.groq.com/openai/v1",
  auth: { apiKey: envApiKeyAuth("Groq API key", ["GROQ_API_KEY"]) },
  api: openAICompletionsApi(),   // 复用 OpenAI 协议
  ```

  所以接入一个兼容 OpenAI 的新厂商几乎不用写代码。

文件后缀的约定：

| 后缀 | 含义 |
|---|---|
| `xxx.lazy.ts` | 只有一行 `lazyApi(() => import("./xxx.ts"))`，第一次请求该协议时才加载对应 SDK（`@anthropic-ai/sdk`、`openai`…），加快启动、方便 tree-shaking |
| `xxx.models.ts` | 由 `catalog/generate.ts` 生成的模型列表，文件头写着 "Do not edit manually" |
| `*.generated.ts` | 同上，生成文件 |

## 5. pi-coding-agent 内部（`packages/coding-agent/`）

```
coding-agent/
├── src/
│   ├── cli.ts        bin 入口：setupCli() + main(argv)
│   ├── main.ts       解析参数，选择运行模式
│   ├── index.ts      SDK 的公共导出（别人 import 这个包时拿到的东西）
│   ├── rpc-entry.ts  RPC 模式的独立入口
│   │
│   ├── core/         ★ 与 UI 无关的业务逻辑
│   │   ├── agent-session.ts   所有模式共用的会话核心（包装 Agent）
│   │   ├── sdk.ts             组装 Agent + AgentSession
│   │   ├── tools/             read / bash / edit / write / grep / find / ls
│   │   ├── compaction/        上下文压缩
│   │   ├── extensions/        扩展系统本身（loader / runner / types）
│   │   ├── session-manager.ts 会话 jsonl 树
│   │   └── settings-*, model-*, auth-*, skills, prompt-templates…
│   │
│   ├── modes/        ★ I/O 外壳：同一个 AgentSession 的不同"皮"
│   │   ├── interactive/   终端交互界面（components/、theme/）
│   │   ├── print-mode.ts  `pi -p`：打印结果后退出
│   │   ├── json-event.ts  JSON 事件流输出
│   │   └── rpc/           通过 stdin/stdout JSONL 被其它程序驱动
│   │
│   ├── cli/          命令行杂项：参数解析、登录/登出、会话选择、启动 UI
│   ├── extensions/   ★ 内置扩展：mcp、codemode、tool-search、llama
│   ├── bun/          用 Bun 打成独立二进制时的入口和环境处理
│   ├── experimental/ 实验功能
│   └── utils/        通用工具函数（git、剪贴板、ansi、frontmatter…）
├── docs/          用户文档（extensions.md、sdk.md、rpc.md…）
├── examples/      扩展示例（confirm-destructive.ts、custom-compaction.ts…）、SDK、RPC 客户端示例
├── schemas/       配置文件的 JSON Schema
├── install-lock/  安装器固定的依赖版本
└── test/
```

几个命名背后的意图：

- **`core/` vs `modes/`**：经典的"逻辑与表现分离"。`agent-session.ts` 文件头注释写得很明确："This class is shared between all run modes (interactive, print, rpc)… Modes use this class and add their own I/O layer on top." 三种模式只是 `AgentSession` 事件的不同消费者。
  （有一个小例外：`core/` 里有几个文件 import 了 `modes/interactive/theme/theme.ts`，是为了给工具渲染/HTML 导出拿主题色。）
- **`core/extensions/` vs `src/extensions/`**：前者是**扩展机制**（怎么加载、怎么派发事件），后者是**用这套机制写的扩展**。mcp、codemode 这些"大功能"不是写死在核心里，而是作为内置扩展，用的就是第三方扩展同样的 `ExtensionAPI`，并且标了 `replaceable: true`——用户装一个同名扩展就能替换掉内置的。这就是 README 里说的 "minimal, extensible"。
- **`examples/extensions/`**：几十个单文件示例，基本覆盖每个扩展事件，是学扩展 API 最快的入口。

## 6. 文件命名的通用规律

- 全部 kebab-case：`agent-loop.ts`、`session-manager.ts`。
- 一个文件一个概念，文件名就是概念名（AGENTS.md 明确要求："one concept per file, named after it; no grab-bag files"）。
- 角色后缀：`-manager`（持有并持久化状态，如 session-manager、settings-manager）、`-runner`（执行/派发，如 extensions/runner）、`-loader`（加载）、`-mode`（运行模式）、`-registry`（注册表）、`-types`（只放类型）。
- `.test.ts` 在各包的 `test/` 目录下，不和源码混放。

## 7. 学习路线建议

1. 只看栈 A：`ai/src/types.ts` → `agent/src/*` → `coding-agent/src/core/sdk.ts` → `core/agent-session.ts`。
2. 想看 UI 再进 `modes/`，想看可扩展性就看 `core/extensions/` + `examples/extensions/`。
3. 栈 B（chord / durable / env / p2）等前面吃透后再看，它是另一套思路。
