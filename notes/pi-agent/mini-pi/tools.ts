// tools.ts —— L3 产品层的内置工具（对应 packages/coding-agent/src/core/tools/）。
// 四件套 read / write / edit / bash。工具对 agent 内核来说只是 name + schema + execute。
import { spawn } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { AgentTool } from "./agent.ts";

const MAX_OUTPUT = 30_000; // 工具输出过长会撑爆上下文，pi 在 truncate.ts 里做得更细（按行、按字节、写临时文件）

function truncate(text: string): string {
	return text.length <= MAX_OUTPUT ? text : `${text.slice(0, MAX_OUTPUT)}\n...[truncated ${text.length - MAX_OUTPUT} chars]`;
}

/** 同一文件的修改串行、不同文件并行（对应 file-mutation-queue.ts），因为内核默认并行执行工具。 */
const fileLocks = new Map<string, Promise<unknown>>();
function withFileLock<T>(path: string, fn: () => Promise<T>): Promise<T> {
	const prev = fileLocks.get(path) ?? Promise.resolve();
	const next = prev.then(fn, fn);
	fileLocks.set(path, next.catch(() => {}));
	return next;
}

export function createTools(cwd: string): AgentTool[] {
	const abs = (p: unknown) => resolve(cwd, String(p));
	return [
		{
			name: "read",
			description: "Read a text file. Use offset/limit (1-based line numbers) for large files.",
			parameters: {
				type: "object",
				properties: { path: { type: "string" }, offset: { type: "number" }, limit: { type: "number" } },
				required: ["path"],
			},
			async execute({ path, offset, limit }) {
				const lines = (await readFile(abs(path), "utf8")).split("\n");
				const start = Math.max(0, Number(offset ?? 1) - 1);
				const end = limit ? start + Number(limit) : lines.length;
				return truncate(lines.slice(start, end).map((l, i) => `${start + i + 1}\t${l}`).join("\n"));
			},
		},
		{
			name: "write",
			description: "Create or overwrite a file with the given content.",
			parameters: {
				type: "object",
				properties: { path: { type: "string" }, content: { type: "string" } },
				required: ["path", "content"],
			},
			async execute({ path, content }) {
				const file = abs(path);
				await withFileLock(file, () => writeFile(file, String(content)));
				return `Wrote ${String(content).length} chars to ${path}`;
			},
		},
		{
			name: "edit",
			description: "Replace oldText with newText in a file. oldText must match exactly once.",
			parameters: {
				type: "object",
				properties: { path: { type: "string" }, oldText: { type: "string" }, newText: { type: "string" } },
				required: ["path", "oldText", "newText"],
			},
			async execute({ path, oldText, newText }) {
				const file = abs(path);
				return withFileLock(file, async () => {
					const text = await readFile(file, "utf8");
					const count = text.split(String(oldText)).length - 1;
					// 失败要 throw，让模型看到错误并重试；不要只在返回文本里描述失败
					if (count !== 1) throw new Error(`oldText must match exactly once in ${path}, found ${count} matches`);
					await writeFile(file, text.replace(String(oldText), () => String(newText)));
					return `Edited ${path}`;
				});
			},
		},
		{
			name: "bash",
			description: "Run a shell command in the working directory. Returns stdout+stderr and exit code.",
			parameters: { type: "object", properties: { command: { type: "string" } }, required: ["command"] },
			execute({ command }, signal) {
				return new Promise((resolvePromise, reject) => {
					const child = spawn("bash", ["-c", String(command)], { cwd, signal });
					let out = "";
					child.stdout.on("data", (d) => (out += d));
					child.stderr.on("data", (d) => (out += d));
					child.on("error", reject);
					child.on("close", (code) => {
						const text = truncate(out) + (code ? `\n[exit code ${code}]` : "");
						if (code) reject(new Error(text));
						else resolvePromise(text || "(no output)");
					});
				});
			},
		},
	];
}
