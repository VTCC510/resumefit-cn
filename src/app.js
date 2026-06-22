const fields = ["name", "title", "location", "email", "phone", "website", "summary", "skills", "experience", "projects"];

const cnStopWords = new Set([
	"岗位",
	"要求",
	"熟悉",
	"具备",
	"负责",
	"相关",
	"能力",
	"经验",
	"以及",
	"进行",
	"可以",
	"良好",
	"优先",
]);

const sample = {
	name: "李慕",
	title: "前端开发工程师",
	location: "上海",
	email: "limu@example.com",
	phone: "138-0000-0000",
	website: "github.com/VTCC510/resumefit-cn",
	summary:
		"3 年前端开发经验，熟悉 React、TypeScript 与工程化体系，擅长将复杂业务流程沉淀为高可维护组件和可复用工具。",
	skills: "React, TypeScript, Vite, Zustand, Tailwind CSS, Node.js, REST API, 性能优化, 前端工程化, PDF 导出",
	experience:
		"在业务中台团队负责招聘与员工管理模块建设，主导组件库表单能力升级，减少 35% 重复配置代码；优化大列表渲染与查询缓存，将核心页面首屏耗时从 2.8s 降至 1.4s。",
	projects:
		"基于 Reactive Resume 做中文简历模板，增加 JD 匹配和项目润色功能，可以导出 PDF。\n负责企业后台的员工列表和表单配置，做了一些性能优化。",
};

const $ = (selector) => document.querySelector(selector);

function getResumeData() {
	return Object.fromEntries(fields.map((field) => [field, $(`#${field}`).value.trim()]));
}

function splitItems(value) {
	return value
		.split(/[,，、\n]/)
		.map((item) => item.trim())
		.filter(Boolean);
}

function tokenize(text) {
	const english = text.match(/[a-zA-Z][a-zA-Z0-9.+#-]{1,}/g) ?? [];
	const chinese = text.match(/[\u4e00-\u9fa5]{2,}/g) ?? [];
	const phrases = chinese.flatMap((phrase) => {
		const result = [phrase];
		for (let index = 0; index < phrase.length - 1; index += 1) result.push(phrase.slice(index, index + 2));
		return result;
	});

	return [...english, ...phrases]
		.map((item) => item.toLowerCase())
		.filter((item) => item.length > 1 && !cnStopWords.has(item));
}

function uniq(items) {
	return [...new Set(items)];
}

function renderResume() {
	const data = getResumeData();
	$("#previewName").textContent = data.name || "姓名";
	$("#previewTitle").textContent = data.title || "目标岗位";
	$("#previewContact").innerHTML = [data.location, data.email, data.phone, data.website]
		.filter(Boolean)
		.map((item) => `<li>${item}</li>`)
		.join("");
	$("#previewSummary").textContent = data.summary;
	$("#previewSkills").innerHTML = splitItems(data.skills)
		.map((skill) => `<span>${skill}</span>`)
		.join("");
	$("#previewExperience").textContent = data.experience;
	$("#previewProjects").innerHTML = polishProjects(data.projects)
		.map((item) => `<li>${item}</li>`)
		.join("");
}

function calculateMatch() {
	const data = getResumeData();
	const resumeText = `${data.summary} ${data.skills} ${data.experience} ${data.projects}`;
	const jdKeywords = uniq(tokenize($("#jd").value));
	const resumeKeywords = new Set(tokenize(resumeText));
	const hits = jdKeywords.filter((keyword) => resumeKeywords.has(keyword));
	const gaps = jdKeywords.filter((keyword) => !resumeKeywords.has(keyword)).slice(0, 12);
	const score = jdKeywords.length === 0 ? 0 : Math.round((hits.length / jdKeywords.length) * 100);
	const suggestions = gaps.slice(0, 6).map((keyword) => `补充与「${keyword}」相关的经历、技术栈或可量化结果。`);

	$("#matchScore").textContent = score;
	$("#hitCount").textContent = hits.length;
	$("#gapCount").textContent = gaps.length;
	$("#matchReport").innerHTML = `
		<p><strong>命中关键词：</strong>${hits.slice(0, 18).join("、") || "暂无"}</p>
		<p><strong>待补强关键词：</strong>${gaps.join("、") || "暂无明显缺口"}</p>
		<ul>${suggestions.map((item) => `<li>${item}</li>`).join("")}</ul>
	`;
	$("#previewMatch").textContent = `当前 JD 匹配度 ${score} 分；已命中 ${hits.length} 个关键词，建议优先补强：${gaps.slice(0, 5).join("、") || "无"}。`;
}

function polishProjects(text) {
	const actionWords = ["主导", "设计并实现", "优化", "沉淀", "联调交付"];
	return text
		.split(/\n+/)
		.map((line) => line.trim())
		.filter(Boolean)
		.map((line, index) => {
			const action = actionWords[index % actionWords.length];
			const hasMetric = /\d|%|提升|降低|减少|缩短|增加/.test(line);
			const metric = hasMetric ? "" : "，提升交付效率与简历岗位适配质量";
			const technology = line.includes("Reactive Resume")
				? "围绕 Reactive Resume 模板体系、JD 关键词解析与浏览器打印链路"
				: "结合 React 组件化、状态管理与性能分析方法";

			return `${action}${technology}，${line.replace(/[。.]$/, "")}${metric}。`;
		});
}

function renderPolishedProjects() {
	const polished = polishProjects($("#projects").value);
	$("#polishReport").innerHTML = `<ul>${polished.map((item) => `<li>${item}</li>`).join("")}</ul>`;
	$("#previewProjects").innerHTML = polished.map((item) => `<li>${item}</li>`).join("");
}

function exportJson() {
	const blob = new Blob([JSON.stringify(getResumeData(), null, 2)], { type: "application/json" });
	const link = document.createElement("a");
	link.href = URL.createObjectURL(blob);
	link.download = "resumefit-cn-profile.json";
	link.click();
	URL.revokeObjectURL(link.href);
}

function loadSample() {
	for (const [key, value] of Object.entries(sample)) $(`#${key}`).value = value;
	renderResume();
	calculateMatch();
	renderPolishedProjects();
}

for (const field of fields) {
	$(`#${field}`).addEventListener("input", renderResume);
}

for (const tab of document.querySelectorAll(".tab")) {
	tab.addEventListener("click", () => {
		document.querySelectorAll(".tab").forEach((item) => item.classList.remove("active"));
		document.querySelectorAll(".tab-panel").forEach((item) => item.classList.remove("active"));
		tab.classList.add("active");
		$(`#${tab.dataset.tab}`).classList.add("active");
	});
}

$("#matchBtn").addEventListener("click", calculateMatch);
$("#polishBtn").addEventListener("click", renderPolishedProjects);
$("#printPdf").addEventListener("click", () => window.print());
$("#exportJson").addEventListener("click", exportJson);
$("#loadSample").addEventListener("click", loadSample);

renderResume();
calculateMatch();
renderPolishedProjects();
