/**
 * mini-agent-loop.ts —— 按 pi-agent-core 的设计思路手写的极简 agent loop（约 150 行）。
 *
 * 目的：把 packages/agent/src/agent-loop.ts 的骨架抽出来，去掉 hook、并行、tool 声明 diff 等细节，
 * 只保留「双层 while + 流式事件 + 工具执行 + steering/follow-up 队列」这几个核心概念。
 *
 * 不依赖任何 npm 包，也不需要 API key：用一个假的 streamFn 模拟 LLM。
 * 运行：node --experimental-strip-types notes/pi-agent/mini-agent-loop.ts
 */

// ---------- 消息类型（对应 pi-ai 的 Message） ----------
type ToolCall = { type: "toolCall"; id: string; name: string; arguments: Record<string, unknown> };
type Text = { type: "text"; text: string };
type UserMessage = { role: "user"; content: string };
type AssistantMessage = { role: "assistant"; content: (Text | ToolCall)[]; stopReason: "stop" | "toolUse" | "error" };
type ToolResultMessage = { role: "toolResult"; toolCallId: string; content: string; isError: boolean };
type Message = UserMessage | AssistantMessage | ToolResultMessage;

// ---------- 事件（对应 AgentEvent，名字保持一致） ----------
type AgentEvent =
	| { type: "agent_start" }
	| { type: "agent_end"; messages: Message[] }
	| { type: "turn_start" }
	| { type: "turn_end"; message: AssistantMessage; toolResults: ToolResultMessage[] }
	| { type: "message_start" | "message_end"; message: Message }
	| { type: "message_update"; delta: string }
	| { type: "tool_execution_start" | "tool_execution_end"; toolCallId: string; toolName: string };

type Tool = { name: string; execute: (args: any) => Promise<string> };

// streamFn：pi 里返回 AssistantMessageEventStream；这里简化成 async generator，最后 return 完整消息
type StreamFn = (messages: Message[]) => AsyncGenerator<string, AssistantMessage>;

interface LoopConfig {
	streamFn: StreamFn;
	tools: Tool[];
	getSteeringMessages: () => Message[]; // 每个 turn 结束后轮询：用户在 agent 干活时插的话
	getFollowUpMessages: () => Message[]; // agent 本来要停时轮询：排队等 agent 空闲后再处理的话
}

// ---------- 核心：与 pi 的 runLoop 同构的双层循环 ----------
async function runAgentLoop(prompt: Message, context: Message[], cfg: LoopConfig, emit: (e: AgentEvent) => void) {
	const newMessages: Message[] = [prompt];
	context.push(prompt);
	emit({ type: "agent_start" });
	emit({ type: "turn_start" });
	emit({ type: "message_start", message: prompt });
	emit({ type: "message_end", message: prompt });

	let pending: Message[] = cfg.getSteeringMessages();
	let firstTurn = true;

	while (true) { // 外层：处理 follow-up
		let hasMoreToolCalls = true;
		while (hasMoreToolCalls || pending.length > 0) { // 内层：一次迭代 = 一个 turn
			if (!firstTurn) emit({ type: "turn_start" });
			firstTurn = false;

			// 1) 把 steering / follow-up 消息注入上下文
			for (const m of pending) {
				emit({ type: "message_start", message: m });
				emit({ type: "message_end", message: m });
				context.push(m);
				newMessages.push(m);
			}
			pending = [];

			// 2) 流式调用 LLM
			const stream = cfg.streamFn(context);
			// pi 在 provider 的 "start" 事件时发 message_start（带 partial 消息），这里简化为请求前发
			emit({ type: "message_start", message: { role: "assistant", content: [], stopReason: "stop" } });
			let step = await stream.next();
			while (!step.done) {
				emit({ type: "message_update", delta: step.value });
				step = await stream.next();
			}
			const assistant = step.value;
			context.push(assistant);
			newMessages.push(assistant);
			emit({ type: "message_end", message: assistant });

			if (assistant.stopReason === "error") { // 错误 = 硬退出
				emit({ type: "turn_end", message: assistant, toolResults: [] });
				emit({ type: "agent_end", messages: newMessages });
				return newMessages;
			}

			// 3) 执行工具调用（pi 默认 parallel；这里顺序执行）
			const toolResults: ToolResultMessage[] = [];
			for (const call of assistant.content.filter((c): c is ToolCall => c.type === "toolCall")) {
				emit({ type: "tool_execution_start", toolCallId: call.id, toolName: call.name });
				const tool = cfg.tools.find((t) => t.name === call.name);
				let result: ToolResultMessage;
				try {
					if (!tool) throw new Error(`Tool ${call.name} not found`); // 和 pi 一样：错误变成 toolResult，而不是抛出
					result = { role: "toolResult", toolCallId: call.id, content: await tool.execute(call.arguments), isError: false };
				} catch (err) {
					result = { role: "toolResult", toolCallId: call.id, content: String(err), isError: true };
				}
				emit({ type: "tool_execution_end", toolCallId: call.id, toolName: call.name });
				emit({ type: "message_start", message: result });
				emit({ type: "message_end", message: result });
				toolResults.push(result);
				context.push(result);
				newMessages.push(result);
			}
			hasMoreToolCalls = toolResults.length > 0; // 有工具结果 → 必须再问一次 LLM

			emit({ type: "turn_end", message: assistant, toolResults });
			pending = cfg.getSteeringMessages();
		}

		// agent 本来要停了：看看有没有 follow-up
		const followUps = cfg.getFollowUpMessages();
		if (followUps.length > 0) {
			pending = followUps;
			continue;
		}
		break;
	}
	emit({ type: "agent_end", messages: newMessages });
	return newMessages;
}

// ---------- Demo：假的 LLM + 一个计算器工具 ----------
const fakeLlm: StreamFn = async function* (messages) {
	const last = messages[messages.length - 1];
	if (last.role === "user" && last.content.includes("2+3")) {
		yield "让我算一下…";
		return {
			role: "assistant",
			stopReason: "toolUse",
			content: [
				{ type: "text", text: "让我算一下…" },
				{ type: "toolCall", id: "call_1", name: "calc", arguments: { expr: "2+3" } },
			],
		};
	}
	const text = last.role === "toolResult" ? `结果是 ${last.content}。` : `收到：「${(last as UserMessage).content}」`;
	for (const ch of text) yield ch;
	return { role: "assistant", stopReason: "stop", content: [{ type: "text", text }] };
};

const followUpQueue: Message[] = [{ role: "user", content: "谢谢！" }];

await runAgentLoop(
	{ role: "user", content: "2+3 等于几？" },
	[],
	{
		streamFn: fakeLlm,
		tools: [{ name: "calc", execute: async ({ expr }) => String(Function(`return (${expr})`)()) }],
		getSteeringMessages: () => [],
		getFollowUpMessages: () => followUpQueue.splice(0, 1), // 对应 QueueMode "one-at-a-time"
	},
	(e) => {
		if (e.type === "message_update") return; // 省略逐字增量
		const extra = "message" in e && e.type !== "turn_end" ? ` ${e.message.role}` : "toolName" in e ? ` ${e.toolName}` : "";
		console.log(e.type + extra);
	},
);
