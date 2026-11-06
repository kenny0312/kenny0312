// session.ts —— L3 会话持久化（对应 packages/coding-agent/src/core/session-manager.ts）。
// 每行一个 JSON entry；id + parentId 组成树，当前对话 = 从 leaf 回溯到根的路径。
// 只追加不修改：崩溃最多丢最后一行，分叉（回到某个节点重新问）也只是追加一个 parentId 指向旧节点的 entry。
import { randomUUID } from "node:crypto";
import { appendFileSync, existsSync, readFileSync } from "node:fs";
import type { Message } from "./ai.ts";

interface MessageEntry {
	type: "message";
	id: string;
	parentId: string | null;
	message: Message;
}

export class SessionManager {
	readonly file: string;
	private entries = new Map<string, MessageEntry>();
	private leafId: string | null = null;

	constructor(file: string) {
		this.file = file;
		if (!existsSync(file)) return;
		for (const line of readFileSync(file, "utf8").split("\n")) {
			if (!line.trim()) continue;
			const entry = JSON.parse(line) as MessageEntry;
			this.entries.set(entry.id, entry);
			this.leafId = entry.id;
		}
	}

	append(message: Message): void {
		const entry: MessageEntry = { type: "message", id: randomUUID(), parentId: this.leafId, message };
		appendFileSync(this.file, `${JSON.stringify(entry)}\n`);
		this.entries.set(entry.id, entry);
		this.leafId = entry.id;
	}

	/** 当前分支上的消息（pi 的 buildSessionProjection 还会在这里应用压缩摘要）。 */
	messages(): Message[] {
		const path: Message[] = [];
		let id = this.leafId;
		while (id) {
			const entry = this.entries.get(id)!;
			path.unshift(entry.message);
			id = entry.parentId;
		}
		return path;
	}
}
