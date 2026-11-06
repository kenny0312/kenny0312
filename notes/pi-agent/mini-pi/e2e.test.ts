// e2e.test.ts —— 端到端验证：真实 HTTP/SSE → 工具执行 → 会话落盘 → 恢复会话 → steer / followUp。
// 运行：node --experimental-strip-types --test e2e.test.ts
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import type { AgentEvent } from "./agent.ts";
import { createApp } from "./app.ts";
import { startMockServer } from "./mock-openai-server.ts";

test("一个完整请求：两次 HTTP 请求、一次工具调用、按顺序落盘", async () => {
	const { url, requests, server } = await startMockServer();
	const dir = mkdtempSync(join(tmpdir(), "mini-pi-"));
	const sessionFile = join(dir, "s.jsonl");
	const { agent } = createApp({ cwd: dir, model: { id: "mock", api: "openai-completions", baseUrl: url }, sessionFile });
	const events: string[] = [];
	agent.subscribe((e: AgentEvent) => {
		if (e.type !== "message_update") events.push("message" in e && e.type !== "turn_end" ? `${e.type}:${e.message.role}` : e.type);
	});

	await agent.prompt("请 echo 一下");

	// 第二次请求带上了 assistant 的 tool_calls 和 tool 结果（线格式转换正确）
	assert.equal(requests.length, 2);
	const second = requests[1].messages.map((m: any) => m.role);
	assert.deepEqual(second, ["system", "user", "assistant", "tool"]);
	assert.equal(requests[1].messages[2].tool_calls[0].function.arguments, '{"command":"echo hello-from-tool"}');

	const final = agent.messages.at(-1)!;
	assert.equal(final.role, "assistant");
	assert.match(JSON.stringify(final), /hello-from-tool/);
	assert.deepEqual(events, [
		"agent_start",
		"turn_start",
		"message_start:user",
		"message_end:user",
		"message_start:assistant",
		"message_end:assistant",
		"tool_execution_start",
		"tool_execution_end",
		"message_start:toolResult",
		"message_end:toolResult",
		"turn_end",
		"turn_start",
		"message_start:assistant",
		"message_end:assistant",
		"turn_end",
		"agent_end",
	]);

	// 会话文件：4 行，parentId 串成链；新建 app 能恢复出同样的历史
	const lines = readFileSync(sessionFile, "utf8").trim().split("\n").map((l) => JSON.parse(l));
	assert.deepEqual(lines.map((l) => l.message.role), ["user", "assistant", "toolResult", "assistant"]);
	assert.equal(lines[1].parentId, lines[0].id);
	const resumed = createApp({ cwd: dir, model: { id: "mock", api: "openai-completions", baseUrl: url }, sessionFile });
	assert.equal(resumed.agent.messages.length, 4);
	server.close();
});

test("steer 在当前工具执行完后插入；followUp 在 agent 本该停下时插入", async () => {
	const { url, requests, server } = await startMockServer();
	const dir = mkdtempSync(join(tmpdir(), "mini-pi-"));
	const { agent } = createApp({
		cwd: dir,
		model: { id: "mock", api: "openai-completions", baseUrl: url },
		sessionFile: join(dir, "s.jsonl"),
	});
	agent.subscribe((e) => {
		if (e.type === "tool_execution_start") {
			agent.steer("顺便说一句");
			agent.followUp("最后一个问题");
		}
	});
	await agent.prompt("请 echo 一下");

	const userTexts = agent.messages.filter((m) => m.role === "user").map((m) => m.content);
	assert.deepEqual(userTexts, ["请 echo 一下", "顺便说一句", "最后一个问题"]);
	// steer 和工具结果在同一轮被发出：请求 2 的结尾是 tool 结果 + steer 消息
	assert.deepEqual(requests[1].messages.slice(-2).map((m: any) => m.role), ["tool", "user"]);
	assert.equal(requests.length, 3);
	server.close();
});

test("网络错误不抛异常，而是变成 stopReason=error 的消息", async () => {
	const dir = mkdtempSync(join(tmpdir(), "mini-pi-"));
	const { agent } = createApp({
		cwd: dir,
		model: { id: "x", api: "openai-completions", baseUrl: "http://127.0.0.1:1/v1" },
		sessionFile: join(dir, "s.jsonl"),
	});
	await agent.prompt("hi");
	const last = agent.messages.at(-1)!;
	assert.equal(last.role === "assistant" && last.stopReason, "error");
});
