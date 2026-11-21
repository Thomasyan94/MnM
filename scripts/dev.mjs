import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(fileURLToPath(new URL("../", import.meta.url)));
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};
createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(
        new URL(req.url, "http://localhost").pathname,
      ),
      relative = pathname === "/" ? "index.html" : pathname.slice(1);
    const base =
      relative.startsWith("assets/") || relative.startsWith("data/")
        ? path.join(root, "public")
        : root;
    const file = path.resolve(base, relative);
    if (
      !file.startsWith(base + path.sep) ||
      relative.split("/").some((part) => part.startsWith(".")) ||
      !["index.html", "src", "experiments", "assets", "data"].includes(
        relative.split("/")[0],
      )
    ) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    if (!(await stat(file)).isFile()) throw Error("not a file");
    const bytes = await readFile(file);
    res.writeHead(200, {
      "Content-Type": mime[path.extname(file)] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    res.end(bytes);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
}).listen(Number(process.env.PORT || 4173), "0.0.0.0", () =>
  console.log("MnM dev server ready"),
);
