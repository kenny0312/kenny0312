// main.ts —— 入口 + 运行模式（对应 coding-agent 的 cli.ts / main.ts / modes/）。
// 两种模式只是同一个 Agent 事件流的不同消费者：
//   print 模式：node main.ts -p "问题"     —— 跑完一次就退出
//   交互模式：  node main.ts               —— REPL（steer/followUp 见 e2e.test.ts）
//
// 环境变量（任意 OpenAI 兼容服务：OpenAI / DeepSeek / Groq / Ollama / vLLM…）：
//   MINI_PI_BASE_URL  例如 https://api.openai.com/v1 或 http://localhost:11434/v1
//   MINI_PI_API_KEY
//   MINI_PI_MODEL     例如 gpt-4o-mini
// 不设置 MINI_PI_BASE_URL 时使用 faux 假模型（会调用一次 bash 列目录，再总结）。
import { createInterface } from "node:readline/promises";
import { type Model, registerFaux } from "./ai.ts";
import type { AgentEvent } from "./agent.ts";
import { createApp } from "./app.ts";

const args = process.argv.slice(2);
const printIndex = args.indexOf("-p");
const printPrompt = printIndex === -1 ? undefined : args[printIndex + 1];
const sessionIndex = args.indexOf("--session");
const sessionFile = sessionIndex === -1 ? `mini-pi-session-${Date.now()}.jsonl` : args[sessionIndex + 1];

const baseUrl = process.env.MINI_PI_BASE_URL;
const model: Model = baseUrl
	? { id: process.env.MINI_PI_MODEL ?? "gpt-4o-mini", api: "openai-completions", baseUrl }
	: { id: "faux", api: "faux", baseUrl: "" };
if (!baseUrl) {
	registerFaux((ctx) => {
		const last = ctx.messages.at(-1);
		if (last?.role === "toolResult") return [{ type: "text", text: `(faux) 目录里有：\n${last.content}` }];
		return [{ type: "toolCall", id: `call_${Date.now()}`, name: "bash", arguments: { command: "ls" } }];
	});
}

const rl = printPrompt === undefined ? createInterface({ input: process.stdin, output: process.stdout }) : undefined;
const { agent } = createApp({
	cwd: process.cwd(),
	model,
	apiKey: process.env.MINI_PI_API_KEY,
	sessionFile,
	// 交互模式下 bash 需要确认；print 模式直接放行
	confirmTool: rl ? async (_name, a) => (await rl.question(`\n允许执行 ${JSON.stringify(a)}? [y/N] `)).trim() === "y" : undefined,
});

agent.subscribe(render);

function render(e: AgentEvent): void {
	if (e.type === "message_update" && e.kind === "text") process.stdout.write(e.delta);
	else if (e.type === "tool_execution_start") process.stdout.write(`\n⚙ ${e.toolName} ${JSON.stringify(e.args)}\n`);
	else if (e.type === "tool_execution_end") process.stdout.write(`${e.isError ? "✗" : "✓"} ${e.result.split("\n")[0].slice(0, 100)}\n`);
	else if (e.type === "message_end" && e.message.role === "assistant") {
		if (e.message.errorMessage) process.stdout.write(`\n[${e.message.stopReason}] ${e.message.errorMessage}`);
		process.stdout.write("\n");
	}
}

if (printPrompt !== undefined) {
	await agent.prompt(printPrompt);
} else {
	console.log(`mini-pi  model=${model.id}  session=${sessionFile}  (Ctrl+C 退出)`);
	while (true) {
		const text = (await rl!.question("\n> ")).trim();
		if (!text) continue;
		await agent.prompt(text);
	}
}
