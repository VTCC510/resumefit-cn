import { createReadStream, existsSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = normalize(fileURLToPath(new URL("..", import.meta.url)));
const port = Number(process.env.PORT ?? 4177);

const contentTypes = {
	".css": "text/css; charset=utf-8",
	".html": "text/html; charset=utf-8",
	".js": "text/javascript; charset=utf-8",
	".json": "application/json; charset=utf-8",
	".svg": "image/svg+xml",
};

createServer((request, response) => {
	const url = new URL(request.url ?? "/", `http://localhost:${port}`);
	const requestedPath = normalize(join(root, decodeURIComponent(url.pathname)));
	const filePath = requestedPath.startsWith(root)
		? requestedPath.endsWith("\\") || requestedPath.endsWith("/")
			? join(requestedPath, "index.html")
			: requestedPath
		: join(root, "index.html");

	const resolvedPath = existsSync(filePath) ? filePath : join(root, "index.html");
	response.setHeader("Content-Type", contentTypes[extname(resolvedPath)] ?? "text/plain; charset=utf-8");
	createReadStream(resolvedPath).pipe(response);
}).listen(port, () => {
	console.log(`ResumeFit CN running at http://localhost:${port}`);
});
