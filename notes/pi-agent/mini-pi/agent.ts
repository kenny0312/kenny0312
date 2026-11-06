// agent.ts —— L2 agent 内核（对应 packages/agent）。
// 只依赖 ai.ts。不知道文件系统、终端、会话文件的存在：这些都由上层通过 tools / 钩子 / 事件注入。
import {
	type AssistantMessage,
	type Message,
	type Model,
	type StreamFn,
	type Tool,
	type ToolCall,
	type ToolResultMessage,
} from "./ai.ts";

export interface AgentTool extends Tool {
	/** 抛异常 = 失败；循环会把它变成 isError 的 toolResult 回给模型。 */
	execute(args: Record<string, unknown>, signal?: AbortSignal): Promise<string>;
}

export type AgentEvent =
	| { type: "agent_start" }
	| { type: "agent_end"; messages: Message[] }
	| { type: "turn_start" }
	| { type: "turn_end"; message: AssistantMessage; toolResults: ToolResultMessage[] }
	| { type: "message_start"; message: Message }
	| { type: "message_update"; message: AssistantMessage; kind: "text" | "toolcall"; delta: string }
	| { type: "message_end"; message: Message }
	| { type: "tool_execution_start"; toolCallId: string; toolName: string; args: unknown }
	| { type: "tool_execution_end"; toolCallId: string; toolName: string; result: string; isError: boolean };

export interface AgentLoopConfig {
	model: Model;
	systemPrompt: string;
	tools: AgentTool[];
	streamFn: StreamFn;
	getApiKey?: () => string | undefined;
	/** 每个 turn 结束后轮询：用户在 agent 干活时插的话。 */
	getSteeringMessages: () => Message[];
	/** agent 本来要停时轮询：排队等 agent 空闲后再处理的话。 */
	getFollowUpMessages: () => Message[];
	/** 返回 { block: true } 阻止执行（权限确认就挂在这里）。 */
	beforeToolCall?: (call: ToolCall) => Promise<{ block?: boolean; reason?: string } | undefined>;
}

type Emit = (event: AgentEvent) => Promise<void>;

/** 无状态的核心循环：所有状态都在 messages 和 config 里。返回本次 run 新增的消息。 */
export async function runAgentLoop(
	prompts: Message[],
	messages: Message[],
	config: AgentLoopConfig,
	emit: Emit,
	signal?: AbortSignal,
): Promise<Message[]> {
	const newMessages: Message[] = [];
	await emit({ type: "agent_start" });
	let pending: Message[] = [...prompts, ...config.getSteeringMessages()];

	while (true) {
		let hasMoreToolCalls = true;
		while (hasMoreToolCalls || pending.length > 0) {
			await emit({ type: "turn_start" });
			// pi 在这里（非首轮）调用 prepareNextTurn，在请求前调用 prepareRequest —— 压缩、换模型都挂在这两个钩子上

			for (const m of pending) {
				messages.push(m);
				newMessages.push(m);
				await emit({ type: "message_start", message: m });
				await emit({ type: "message_end", message: m });
			}
			pending = [];

			const assistant = await streamAssistantResponse(messages, config, emit, signal);
			newMessages.push(assistant);
			if (assistant.stopReason === "error" || assistant.stopReason === "aborted") {
				await emit({ type: "turn_end", message: assistant, toolResults: [] });
				await emit({ type: "agent_end", messages: newMessages });
				return newMessages;
			}

			const calls = assistant.content.filter((c): c is ToolCall => c.type === "toolCall");
			const toolResults =
				assistant.stopReason === "length"
					? await failTruncated(calls, emit) // 输出被截断：参数可能不完整，一律不执行
					: await executeToolCalls(calls, config, emit, signal);
			for (const r of toolResults) {
				messages.push(r);
				newMessages.push(r);
			}
			hasMoreToolCalls = toolResults.length > 0;
			await emit({ type: "turn_end", message: assistant, toolResults });
			pending = config.getSteeringMessages();
		}

		const followUps = config.getFollowUpMessages();
		if (followUps.length === 0) break;
		pending = followUps;
	}
	await emit({ type: "agent_end", messages: newMessages });
	return newMessages;
}

async function streamAssistantResponse(
	messages: Message[],
	config: AgentLoopConfig,
	emit: Emit,
	signal?: AbortSignal,
): Promise<AssistantMessage> {
	const stream = config.streamFn(
		config.model,
		{ systemPrompt: config.systemPrompt, messages, tools: config.tools },
		{ apiKey: config.getApiKey?.(), signal },
	);
	let started = false;
	for await (const event of stream) {
		if (event.type === "start") {
			started = true;
			await emit({ type: "message_start", message: { ...event.partial } });
		} else if (event.type === "text_delta" || event.type === "toolcall_delta") {
			// 用事件自身的类型判断是什么增量；partial 是生产者持续修改的共享对象，读它的"当前末尾"会读到更新的内容
			const kind = event.type === "text_delta" ? "text" : "toolcall";
			await emit({ type: "message_update", message: { ...event.partial }, kind, delta: event.delta });
		}
	}
	const final = await stream.result();
	messages.push(final);
	if (!started) await emit({ type: "message_start", message: final });
	await emit({ type: "message_end", message: final });
	return final;
}

/** 并行执行，但结果按模型给出的原始顺序返回（provider 要求 tool_call 与结果一一配对）。 */
async function executeToolCalls(
	calls: ToolCall[],
	config: AgentLoopConfig,
	emit: Emit,
	signal?: AbortSignal,
): Promise<ToolResultMessage[]> {
	// 准备阶段串行（权限确认不能同时弹多个），执行阶段并行
	const jobs: (() => Promise<ToolResultMessage>)[] = [];
	for (const call of calls) {
		await emit({ type: "tool_execution_start", toolCallId: call.id, toolName: call.name, args: call.arguments });
		const prepared = await prepare(call, config);
		jobs.push(async () => {
			let result: string;
			let isError = false;
			if (typeof prepared === "string") {
				result = prepared;
				isError = true;
			} else {
				try {
					result = await prepared.execute(call.arguments, signal);
				} catch (err) {
					result = err instanceof Error ? err.message : String(err);
					isError = true;
				}
			}
			await emit({ type: "tool_execution_end", toolCallId: call.id, toolName: call.name, result, isError });
			return toolResult(call, result, isError);
		});
	}
	const results = await Promise.all(jobs.map((job) => job()));
	for (const r of results) {
		await emit({ type: "message_start", message: r });
		await emit({ type: "message_end", message: r });
	}
	return results;
}

/** 返回可执行的工具，或一段错误文本（找不到 / 参数不合法 / 被拦截）。 */
async function prepare(call: ToolCall, config: AgentLoopConfig): Promise<AgentTool | string> {
	const tool = config.tools.find((t) => t.name === call.name);
	if (!tool) return `Tool ${call.name} not found`;
	// pi 用完整 JSON Schema 校验（pi-schema），这里只检查必填字段
	const missing = (tool.parameters.required ?? []).filter((k) => !(k in call.arguments));
	if (missing.length) return `Invalid arguments for ${call.name}: missing ${missing.join(", ")}`;
	const decision = await config.beforeToolCall?.(call);
	if (decision?.block) return decision.reason ?? "Tool execution was blocked";
	return tool;
}

async function failTruncated(calls: ToolCall[], emit: Emit): Promise<ToolResultMessage[]> {
	const results: ToolResultMessage[] = [];
	for (const call of calls) {
		const text = `Tool call "${call.name}" was not executed: output hit the token limit. Re-issue it with complete arguments.`;
		await emit({ type: "tool_execution_start", toolCallId: call.id, toolName: call.name, args: call.arguments });
		await emit({ type: "tool_execution_end", toolCallId: call.id, toolName: call.name, result: text, isError: true });
		const r = toolResult(call, text, true);
		await emit({ type: "message_start", message: r });
		await emit({ type: "message_end", message: r });
		results.push(r);
	}
	return results;
}

function toolResult(call: ToolCall, content: string, isError: boolean): ToolResultMessage {
	return { role: "toolResult", toolCallId: call.id, toolName: call.name, content, isError, timestamp: Date.now() };
}

// ---------- 有状态封装（对应 agent.ts 的 Agent 类） ----------
export interface AgentOptions extends Omit<AgentLoopConfig, "getSteeringMessages" | "getFollowUpMessages"> {
	messages?: Message[];
}

export class Agent {
	readonly messages: Message[];
	isStreaming = false;
	private options: AgentOptions;
	private listeners = new Set<(e: AgentEvent) => Promise<void> | void>();
	private steeringQueue: Message[] = [];
	private followUpQueue: Message[] = [];
	private abortController?: AbortController;
	private idle: Promise<void> = Promise.resolve();

	constructor(options: AgentOptions) {
		this.options = options;
		this.messages = [...(options.messages ?? [])];
	}

	subscribe(listener: (e: AgentEvent) => Promise<void> | void): () => void {
		this.listeners.add(listener);
		return () => this.listeners.delete(listener);
	}

	steer(text: string): void {
		this.steeringQueue.push(userMessage(text));
	}

	followUp(text: string): void {
		this.followUpQueue.push(userMessage(text));
	}

	abort(): void {
		this.abortController?.abort();
	}

	waitForIdle(): Promise<void> {
		return this.idle;
	}

	async prompt(text: string): Promise<void> {
		if (this.isStreaming) throw new Error("Agent is busy. Use steer() or followUp().");
		this.isStreaming = true;
		this.abortController = new AbortController();
		let done!: () => void;
		this.idle = new Promise((r) => {
			done = r;
		});
		try {
			await runAgentLoop(
				[userMessage(text)],
				this.messages,
				{
					...this.options,
					getSteeringMessages: () => this.steeringQueue.splice(0, 1), // one-at-a-time
					getFollowUpMessages: () => this.followUpQueue.splice(0, 1),
				},
				async (e) => {
					for (const l of this.listeners) await l(e); // 依次 await：监听者（如落盘）是 run 的一部分
				},
				this.abortController.signal,
			);
		} finally {
			this.isStreaming = false;
			this.abortController = undefined;
			done();
		}
	}
}

function userMessage(text: string): Message {
	return { role: "user", content: text, timestamp: Date.now() };
}
