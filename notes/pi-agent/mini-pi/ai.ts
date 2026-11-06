// ai.ts —— L1 模型接入层（对应 packages/ai）。
// 职责：定义统一的消息/事件类型，把不同厂商的协议翻译成同一种事件流。
// 契约（和 pi 一样）：streamSimple 永远不抛异常，失败编码为 stopReason "error" | "aborted"。

// ---------- 统一消息类型 ----------
export type TextContent = { type: "text"; text: string };
export type ToolCall = { type: "toolCall"; id: string; name: string; arguments: Record<string, unknown> };
export type StopReason = "stop" | "length" | "toolUse" | "error" | "aborted";

export type UserMessage = { role: "user"; content: string; timestamp: number };
export type AssistantMessage = {
	role: "assistant";
	content: (TextContent | ToolCall)[];
	stopReason: StopReason;
	errorMessage?: string;
	timestamp: number;
};
export type ToolResultMessage = {
	role: "toolResult";
	toolCallId: string;
	toolName: string;
	content: string;
	isError: boolean;
	timestamp: number;
};
export type Message = UserMessage | AssistantMessage | ToolResultMessage;

export interface Tool {
	name: string;
	description: string;
	parameters: { type: "object"; properties: Record<string, object>; required?: string[] };
}

export interface Context {
	systemPrompt: string;
	messages: Message[];
	tools: Tool[];
}

/** api 是"协议名"，不是公司名：一个协议可以服务多家厂商（对应 pi 的 api/ 与 providers/ 之分）。 */
export interface Model {
	id: string;
	api: string;
	baseUrl: string;
}

export interface StreamOptions {
	apiKey?: string;
	signal?: AbortSignal;
}

// ---------- 统一事件协议（pi 的 AssistantMessageEvent 的子集） ----------
export type AssistantMessageEvent =
	| { type: "start"; partial: AssistantMessage }
	| { type: "text_delta"; delta: string; partial: AssistantMessage }
	| { type: "toolcall_delta"; delta: string; partial: AssistantMessage }
	| { type: "done"; message: AssistantMessage }
	| { type: "error"; error: AssistantMessage };

/** 推模型 → 拉模型：生产者 push，消费者 for await；result() 拿最终消息。对应 ai/src/utils/event-stream.ts。 */
export class AssistantMessageEventStream implements AsyncIterable<AssistantMessageEvent> {
	private queue: AssistantMessageEvent[] = [];
	private waiters: ((r: IteratorResult<AssistantMessageEvent>) => void)[] = [];
	private done = false;
	private resolveResult!: (m: AssistantMessage) => void;
	private finalResult = new Promise<AssistantMessage>((r) => {
		this.resolveResult = r;
	});

	push(event: AssistantMessageEvent): void {
		if (this.done) return;
		if (event.type === "done" || event.type === "error") {
			this.done = true;
			this.resolveResult(event.type === "done" ? event.message : event.error);
		}
		const waiter = this.waiters.shift();
		if (waiter) waiter({ value: event, done: false });
		else this.queue.push(event);
		if (this.done) for (const w of this.waiters.splice(0)) w({ value: undefined, done: true });
	}

	async *[Symbol.asyncIterator](): AsyncIterator<AssistantMessageEvent> {
		while (true) {
			if (this.queue.length > 0) yield this.queue.shift()!;
			else if (this.done) return;
			else {
				const r = await new Promise<IteratorResult<AssistantMessageEvent>>((res) => this.waiters.push(res));
				if (r.done) return;
				yield r.value;
			}
		}
	}

	result(): Promise<AssistantMessage> {
		return this.finalResult;
	}
}

export type StreamFn = (model: Model, context: Context, options?: StreamOptions) => AssistantMessageEventStream;

// ---------- 协议注册表：streamSimple 按 model.api 分发 ----------
const apis = new Map<string, StreamFn>();

export function registerApi(api: string, fn: StreamFn): void {
	apis.set(api, fn);
}

export function streamSimple(model: Model, context: Context, options?: StreamOptions): AssistantMessageEventStream {
	const fn = apis.get(model.api);
	if (fn) return fn(model, context, options);
	const stream = new AssistantMessageEventStream();
	stream.push({ type: "error", error: errorMessage(`Unknown api: ${model.api}`, "error") });
	return stream;
}

function errorMessage(message: string, stopReason: "error" | "aborted"): AssistantMessage {
	return { role: "assistant", content: [], stopReason, errorMessage: message, timestamp: Date.now() };
}

// ---------- 协议 1：OpenAI Chat Completions（兼容 OpenAI/DeepSeek/Groq/Ollama/vLLM…） ----------
registerApi("openai-completions", (model, context, options) => {
	const stream = new AssistantMessageEventStream();
	const output: AssistantMessage = { role: "assistant", content: [], stopReason: "stop", timestamp: Date.now() };

	(async () => {
		try {
			const res = await fetch(`${model.baseUrl}/chat/completions`, {
				method: "POST",
				headers: {
					"content-type": "application/json",
					...(options?.apiKey ? { authorization: `Bearer ${options.apiKey}` } : {}),
				},
				body: JSON.stringify({
					model: model.id,
					stream: true,
					messages: toOpenAIMessages(context),
					tools: context.tools.length ? context.tools.map((t) => ({ type: "function", function: t })) : undefined,
				}),
				signal: options?.signal,
			});
			if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
			stream.push({ type: "start", partial: output });

			// 工具参数是分片流过来的 JSON 字符串，先累积，结束后再解析
			const pendingCalls = new Map<number, { block: ToolCall; json: string }>();
			for await (const data of sseData(res.body)) {
				if (data === "[DONE]") break;
				const choice = JSON.parse(data).choices?.[0];
				if (!choice) continue;
				const delta = choice.delta ?? {};
				if (delta.content) {
					let last = output.content.at(-1);
					if (last?.type !== "text") {
						last = { type: "text", text: "" };
						output.content.push(last);
					}
					last.text += delta.content;
					stream.push({ type: "text_delta", delta: delta.content, partial: output });
				}
				for (const tc of delta.tool_calls ?? []) {
					let entry = pendingCalls.get(tc.index);
					if (!entry) {
						entry = { block: { type: "toolCall", id: tc.id, name: tc.function?.name ?? "", arguments: {} }, json: "" };
						pendingCalls.set(tc.index, entry);
						output.content.push(entry.block);
					}
					if (tc.function?.arguments) {
						entry.json += tc.function.arguments;
						stream.push({ type: "toolcall_delta", delta: tc.function.arguments, partial: output });
					}
				}
				if (choice.finish_reason) output.stopReason = mapStopReason(choice.finish_reason);
			}
			// 被 length 截断时 JSON 可能不完整：pi 用"尽力修复"解析器，这里解析失败就当空参数，交给 agent 层判错
			for (const { block, json } of pendingCalls.values()) {
				try {
					block.arguments = json ? JSON.parse(json) : {};
				} catch {
					block.arguments = {};
				}
			}
			stream.push({ type: "done", message: output });
		} catch (err) {
			output.stopReason = options?.signal?.aborted ? "aborted" : "error";
			output.errorMessage = err instanceof Error ? err.message : String(err);
			stream.push({ type: "error", error: output });
		}
	})();
	return stream;
});

function mapStopReason(reason: string): StopReason {
	if (reason === "tool_calls") return "toolUse";
	if (reason === "length") return "length";
	return "stop";
}

/** 统一消息 → OpenAI 线格式。每个协议都要写一个这样的转换（pi 里是各 api/*.ts 的 convertMessages）。 */
function toOpenAIMessages(context: Context): object[] {
	const out: object[] = [{ role: "system", content: context.systemPrompt }];
	for (const m of context.messages) {
		if (m.role === "user") out.push({ role: "user", content: m.content });
		else if (m.role === "toolResult") out.push({ role: "tool", tool_call_id: m.toolCallId, content: m.content });
		else {
			const text = m.content.flatMap((c) => (c.type === "text" ? [c.text] : [])).join("");
			const calls = m.content.flatMap((c) =>
				c.type === "toolCall"
					? [{ id: c.id, type: "function", function: { name: c.name, arguments: JSON.stringify(c.arguments) } }]
					: [],
			);
			out.push({ role: "assistant", content: text || null, ...(calls.length ? { tool_calls: calls } : {}) });
		}
	}
	return out;
}

/** 极简 SSE 解析：按行切分，取 "data: " 后面的内容。 */
async function* sseData(body: ReadableStream<Uint8Array>): AsyncGenerator<string> {
	const decoder = new TextDecoder();
	let buffer = "";
	for await (const chunk of body as unknown as AsyncIterable<Uint8Array>) {
		buffer += decoder.decode(chunk, { stream: true });
		let nl = buffer.indexOf("\n");
		while (nl !== -1) {
			const line = buffer.slice(0, nl).trim();
			buffer = buffer.slice(nl + 1);
			if (line.startsWith("data:")) yield line.slice(5).trim();
			nl = buffer.indexOf("\n");
		}
	}
}

// ---------- 协议 2：faux（假模型，测试和无 key 演示用；pi 里是 providers/faux.ts） ----------
export type FauxResponder = (context: Context) => (TextContent | ToolCall)[];

export function registerFaux(responder: FauxResponder): void {
	registerApi("faux", (_model, context) => {
		const stream = new AssistantMessageEventStream();
		const content = responder(context);
		const message: AssistantMessage = {
			role: "assistant",
			content,
			stopReason: content.some((c) => c.type === "toolCall") ? "toolUse" : "stop",
			timestamp: Date.now(),
		};
		queueMicrotask(() => {
			stream.push({ type: "start", partial: { ...message, content: [] } });
			for (const c of content) if (c.type === "text") stream.push({ type: "text_delta", delta: c.text, partial: message });
			stream.push({ type: "done", message });
		});
		return stream;
	});
}
