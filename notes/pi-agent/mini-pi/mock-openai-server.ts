// mock-openai-server.ts —— 本地模拟 OpenAI Chat Completions 流式接口，用来在没有 API key 时测试真实的 HTTP + SSE 链路。
// 行为：最后一条是 user → 返回一个 bash 工具调用（参数故意拆成多片流式发送）；最后一条是 tool → 返回文字总结。
import { createServer, type Server } from "node:http";

export function startMockServer(): Promise<{ url: string; requests: any[]; server: Server }> {
	const requests: any[] = [];
	const server = createServer(async (req, res) => {
		let body = "";
		for await (const chunk of req) body += chunk;
		const request = JSON.parse(body);
		requests.push(request);
		res.writeHead(200, { "content-type": "text/event-stream" });
		const send = (obj: object) => res.write(`data: ${JSON.stringify(obj)}\n\n`);
		const last = request.messages.at(-1);

		if (last.role === "user" && String(last.content).includes("echo")) {
			send({ choices: [{ delta: { content: "我来运行一下。" } }] });
			const call = { index: 0, id: "call_1", type: "function", function: { name: "bash", arguments: "" } };
			send({ choices: [{ delta: { tool_calls: [call] } }] });
			for (const piece of ['{"comm', 'and": "echo ', 'hello-from-tool"}'])
				send({ choices: [{ delta: { tool_calls: [{ index: 0, function: { arguments: piece } }] } }] });
			send({ choices: [{ delta: {}, finish_reason: "tool_calls" }] });
		} else {
			const text = last.role === "tool" ? `工具输出是：${last.content.trim()}` : `你说的是：${last.content}`;
			for (const ch of text) send({ choices: [{ delta: { content: ch } }] });
			send({ choices: [{ delta: {}, finish_reason: "stop" }] });
		}
		res.end("data: [DONE]\n\n");
	});
	return new Promise((resolve) =>
		server.listen(0, "127.0.0.1", () => {
			const address = server.address();
			const port = typeof address === "object" && address ? address.port : 0;
			resolve({ url: `http://127.0.0.1:${port}/v1`, requests, server });
		}),
	);
}

// 直接运行时作为独立服务器：node --experimental-strip-types mock-openai-server.ts
if (import.meta.url === `file://${process.argv[1]}`) {
	const { url } = await startMockServer();
	console.log(`mock server: MINI_PI_BASE_URL=${url}`);
}
