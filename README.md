# ResumeFit CN

基于 [Reactive Resume](https://github.com/amruthpillai/reactive-resume) 二次开发的中文简历增强工具，面向中文求职场景提供简历模板、岗位匹配、项目经历润色与 PDF 导出能力。

## 功能亮点

- 中文简历模板：A4 版式、中文信息层级、项目/经历/技能模块。
- 岗位 JD 匹配：解析 JD 关键词，计算匹配度、缺口词与优化建议。
- 项目经历润色：将普通项目描述改写为「动作 + 技术 + 结果」的中文简历 bullet。
- PDF 导出：通过浏览器打印样式导出 A4 PDF，适合本地演示和作品集展示。
- JSON 导出：可导出当前表单数据，便于后续扩展导入能力。

## 快速开始

直接用浏览器打开：

```text
index.html
```

如果本机有 Node，也可以启动本地服务：

```bash
npm run dev
```

默认访问地址：

```text
http://localhost:4177
```

运行 smoke test：

```bash
npm test
```

## 项目背景

Reactive Resume 是一个开源简历构建器。本项目在其简历生成理念基础上，补充中文求职场景中更常见的能力：中文模板、JD 匹配、项目经历润色和 PDF 导出闭环。

## 可写入简历的项目描述

ResumeFit CN：基于 Reactive Resume 进行二次开发，新增中文 A4 简历模板、JD 关键词匹配评分、项目经历智能润色与浏览器 PDF 导出能力；通过本地规则引擎实现无后端可演示闭环，覆盖中文求职场景下的简历生成、岗位适配和作品展示流程。

## License

MIT
