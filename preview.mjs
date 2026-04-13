import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const host = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT || 4173);

const contentTypes = {
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".svg": "image/svg+xml; charset=utf-8",
    ".txt": "text/plain; charset=utf-8",
    ".webp": "image/webp",
    ".xml": "application/xml; charset=utf-8"
};

function toFilePath(urlPath) {
    const requestPath = decodeURIComponent(urlPath.split("?")[0]);
    const relativePath = requestPath.replace(/^[/\\]+/, "");
    const safePath = path.normalize(relativePath).replace(/^(\.\.[/\\])+/, "");
    const joinedPath = path.join(root, safePath);

    if (!joinedPath.startsWith(root)) {
        return null;
    }

    return joinedPath;
}

async function resolvePath(urlPath) {
    const candidate = toFilePath(urlPath);

    if (!candidate) {
        return null;
    }

    const stats = await stat(candidate).catch(() => null);

    if (stats?.isDirectory()) {
        return path.join(candidate, "index.html");
    }

    return candidate;
}

const server = http.createServer(async (req, res) => {
    const filePath = await resolvePath(req.url || "/");

    if (!filePath) {
        res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Forbidden");
        return;
    }

    try {
        const file = await readFile(filePath);
        const ext = path.extname(filePath).toLowerCase();

        res.writeHead(200, {
            "Cache-Control": "no-store",
            "Content-Security-Policy": "default-src 'self'; script-src 'self' https://code.jquery.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com 'unsafe-inline'; style-src 'self' https://cdn.jsdelivr.net https://fonts.googleapis.com 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net; img-src 'self' data: https:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests",
            "Content-Type": contentTypes[ext] || "application/octet-stream",
            "Referrer-Policy": "no-referrer",
            "X-Content-Type-Options": "nosniff",
            "X-Frame-Options": "DENY"
        });
        res.end(file);
    } catch {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Not found");
    }
});

server.listen(port, host, () => {
    console.log(`Preview server running at http://${host}:${port}`);
});
