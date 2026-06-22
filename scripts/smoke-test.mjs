import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const html = readFileSync(join(root, "index.html"), "utf8");
const app = readFileSync(join(root, "src", "app.js"), "utf8");

const requiredHtml = ["中文简历模板", "岗位 JD 匹配", "项目经历润色", "导出 PDF"];
const requiredJs = ["calculateMatch", "polishProjects", "window.print", "renderResume"];

for (const text of requiredHtml) {
	if (!html.includes(text)) throw new Error(`Missing UI text: ${text}`);
}

for (const text of requiredJs) {
	if (!app.includes(text)) throw new Error(`Missing implementation hook: ${text}`);
}

console.log("ResumeFit CN smoke test passed.");
