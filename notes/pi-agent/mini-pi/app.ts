// app.ts —— L3 装配层（对应 coding-agent 的 core/sdk.ts + core/agent-session.ts + core/system-prompt.ts）。
// 把 模型 + 工具 + 系统提示 + 会话持久化 组装成一个 Agent，所有运行模式（交互 / print）共用它。
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { type Model, streamSimple } from "./ai.ts";
import { Agent, type AgentTool } from "./agent.ts";
import { SessionManager } from "./session.ts";
import { createTools } from "./tools.ts";

export interface AppOptions {
	cwd: string;
	model: Model;
	apiKey?: string;
	sessionFile: string;
	confirmTool?: (name: string, args: unknown) => Promise<boolean>;
}

export function createApp(options: AppOptions): { agent: Agent; session: SessionManager } {
	const session = new SessionManager(options.sessionFile);
	const tools = createTools(options.cwd);
	const agent = new Agent({
		model: options.model,
		systemPrompt: buildSystemPrompt(options.cwd, tools),
		tools,
		streamFn: streamSimple,
		getApiKey: () => options.apiKey, // pi 每次请求都重新取（OAuth token 会过期）
		messages: session.messages(), // 恢复历史会话
		beforeToolCall: async (call) => {
			if (call.name !== "bash" || !options.confirmTool) return undefined;
			const ok = await options.confirmTool(call.name, call.arguments);
			return ok ? undefined : { block: true, reason: "User denied this command." };
		},
	});
	// 落盘只是事件的一个订阅者：message_end 时追加一行（对应 AgentSession._handleAgentEvent）
	agent.subscribe((e) => {
		if (e.type === "message_end") session.append(e.message);
	});
	return { agent, session };
}

function buildSystemPrompt(cwd: string, tools: AgentTool[]): string {
	const parts = [
		"You are an expert coding assistant. You help users by reading files, running commands, editing code and writing files.",
		`Available tools:\n${tools.map((t) => `- ${t.name}: ${t.description}`).join("\n")}`,
		"Guidelines:\n- Read a file before editing it.\n- Use edit for small changes, write for new files.\n- Be concise.",
	];
	// 项目上下文文件：pi 会向上逐级查找 AGENTS.md / CLAUDE.md
	const agentsFile = join(cwd, "AGENTS.md");
	if (existsSync(agentsFile)) parts.push(`<project_context path="AGENTS.md">\n${readFileSync(agentsFile, "utf8")}\n</project_context>`);
	parts.push(`Current date: ${new Date().toISOString().slice(0, 10)}\nCurrent working directory: ${cwd}`);
	return parts.join("\n\n");
}
