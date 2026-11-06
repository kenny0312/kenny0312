# 03 · 为什么用 packages/ 文件夹？为什么用 TypeScript？

## 1. `packages/` 是什么意思

### 一个 "package" = 一个可以单独发布、单独安装的单元

在 JavaScript/TypeScript 世界里，**有 `package.json` 的文件夹就是一个包**。`package.json` 相当于这个包的"身份证 + 说明书"：

```jsonc
// packages/coding-agent/package.json（节选）
{
  "name": "@earendil-works/pi-coding-agent",   // 包名：别人 npm install 的就是这个名字
  "version": "1.5.0",
  "bin": { "pi": "dist/bundle/cli.js" },       // 装好后系统里多一个 `pi` 命令
  "main": "./dist/index.js",                   // 别人 import 时拿到的入口
  "dependencies": {
    "@earendil-works/pi-agent-core": "1.5.0",  // 依赖仓库里的另一个包，写死精确版本
    ...
  }
}
```

对比 Python：`package.json` ≈ `pyproject.toml`，npm ≈ pip，`dependencies` ≈ `requirements`。

### monorepo：一个 git 仓库里放多个包

pi 有十几个包。可以每个包一个仓库（multi-repo），也可以全放一个仓库（monorepo）。pi 选了后者，并用 npm 的 **workspaces** 功能把它们连起来：

```jsonc
// 根目录 package.json
"workspaces": ["packages/*", "apps/*", ...]
```

这一行告诉 npm："`packages/` 和 `apps/` 下面每个子文件夹都是一个包"。效果是：

- `npm install` 一次装好所有包的依赖；
- coding-agent 依赖的 `pi-agent-core` 不去 npm 网站下载，而是直接链接到本地的 `packages/agent`——改了内核，产品层立刻能用；
- 一个提交可以同时改内核和产品层，不用先发布内核新版本再去另一个仓库升级。

### 文件夹名 `packages/` 是约定，不是语法

`packages/` 这个名字本身没有魔法，写在 `workspaces` 里的任何路径都行。但它是社区约定（Babel、React、Vue、pnpm 等都这么叫），看到就知道"这里是一堆独立的库"。常见搭配：

| 文件夹 | 惯例含义 |
|---|---|
| `packages/` | 可复用、通常会发布的库 |
| `apps/` | 最终应用，一般不发布（pi 的 `apps/p2`） |
| `scripts/` | 仓库级的构建/检查脚本 |
| `examples/`、`docs/` | 示例、文档 |

### 为什么 pi 要拆成多个包，而不是一个大包

1. **别人可以只用一部分。** 只想统一调各家模型？只装 `pi-ai`。想自己做 agent 产品？装 `pi-agent-core`，不用连 TUI 一起装。README 里提到的 OpenClaw 就是基于 pi 的 SDK 做的另一个产品。
2. **依赖方向被强制。** 包之间只能通过 `dependencies` 引用，`pi-agent-core` 的 `package.json` 里没有 `pi-tui`，它就没法 import 终端界面——分层不靠自觉，靠配置。
3. **公共接口被强制。** 每个包的 `exports` 字段决定外部能 import 什么：

   ```jsonc
   // packages/ai/package.json
   "exports": {
     ".":        { "types": "./dist/index.d.ts",  "import": "./dist/index.js" },
     "./models": { ... },
     "./compat": { ... }
   }
   ```

   没列出来的内部文件，别的包 import 不到。

## 2. 为什么用 TypeScript 而不是 Python

先说结论：**agent 框架本身不做机器学习计算，它做的是"发网络请求、处理流、跑子进程、画界面"**。这类工作 TypeScript/Node 很擅长，而 Python 的最大优势（numpy、PyTorch 等 ML 生态）在这里用不上——模型跑在厂商的服务器上，agent 只是 HTTP 客户端。

下面是具体原因，尽量对应到仓库里的证据。

### (1) 同一份代码能在终端、浏览器、服务器、边缘环境里跑

- `pi-ai` 的 README 有专门的 "Browser Usage" 一节，入口文件刻意写成无副作用，方便打包进网页。
- 仓库有 `scripts/check-browser-smoke.mjs`，CI 会检查这些包在浏览器里能不能用。
- 历史上 pi 做过浏览器扩展和 web-ui（2025-10），用的就是同一个 `pi-ai`。
- `pi-durable` 的测试跑在 workerd（Cloudflare Workers 运行时）上。

Python 基本只能跑在服务器/本地，进不了浏览器。

### (2) 流式、异步、并发是语言的原生能力

agent 一直在等：等模型的流式输出、等工具执行、等用户输入。JavaScript 从一开始就是单线程 + 事件循环 + Promise：

- `for await (const event of stream)` 消费流式输出；
- `Promise.all` 并行跑多个工具（`agent-loop.ts` 的 parallel 模式）；
- `AbortSignal` 一路传下去取消 HTTP 请求和子进程。

Python 也有 asyncio，但它是后加的，生态分成同步/异步两套（`requests` vs `httpx`、很多库不支持 async），混用容易出问题。

### (3) 类型系统特别适合描述"消息"这种数据

agent 的核心数据是各种消息和事件，TypeScript 的**带标签联合类型**（tagged union）描述它们非常准确：

```ts
type AgentEvent =
  | { type: "message_update"; message: AgentMessage; assistantMessageEvent: AssistantMessageEvent }
  | { type: "tool_execution_end"; toolCallId: string; isError: boolean; ... }
  | ...
```

写 `if (event.type === "tool_execution_end")` 之后，编译器就知道 `event.isError` 存在；漏处理一种情况也能被检查出来。

还有一个 pi 专门用到的特性——**声明合并**：应用可以从外部给内核的消息类型"加成员"，内核代码不用改：

```ts
declare module "@earendil-works/pi-agent-core" {
  interface CustomAgentMessages { artifact: ArtifactMessage }
}
```

coding-agent 的 `bashExecution`、`compactionSummary` 等消息就是这么加进去的。Python 的类型提示是可选的、运行时不检查，做不到这种程度。

### (4) 扩展可以直接写 TypeScript，运行时加载

pi 的扩展是用户写的 `.ts` 文件，`core/extensions/loader.ts` 用 jiti 在运行时直接加载，用户不用编译。扩展拿到的 API 带完整类型，编辑器里有自动补全。

### (5) 分发方便

- `npm install -g @earendil-works/pi-coding-agent` 就有了 `pi` 命令（`package.json` 的 `bin` 字段）；
- 还能用 Bun 打成**单个可执行文件**（`src/bun/`、`scripts/build-binaries.sh`），用户机器上不用装 Node；
- 也能打进 Nix。

Python CLI 的分发常见问题是：Python 版本、虚拟环境、系统包冲突。

### (6) 终端 UI 和网页 UI 生态

`pi-tui` 是自己写的差量渲染库，web-ui 用的是网页技术。JS 生态在"界面"这件事上的积累比 Python 多得多。

### 反过来：什么时候 Python 更合适

| 场景 | 更合适 |
|---|---|
| 要在本地跑模型、做向量计算、训练/微调 | Python |
| 要大量用 pandas、科学计算库当工具 | Python |
| 团队主要是数据科学/算法背景 | Python |
| agent 主要是调云端 API + 文件/命令行操作 + 要有界面 | TypeScript |
| 要同时跑在浏览器/边缘环境 | TypeScript |

很多 agent 框架两种都有（LangChain 有 Python 和 JS 两版，OpenAI/Anthropic 的 SDK 两种语言都提供），说明这不是"谁能做谁不能做"，而是看部署环境和团队。

### 补充：pi 用的是"可擦除"的 TypeScript

`AGENTS.md` 规定只能用 Node 的 strip-only 模式支持的语法（不能用 `enum`、`namespace`、构造函数参数属性）。原因是 Node 22 起可以**直接运行 `.ts` 文件**——它只是把类型注解删掉，不做转换。遵守这条规则，源码不编译也能直接跑。mini-pi 也是这么运行的：`node --experimental-strip-types main.ts`。
