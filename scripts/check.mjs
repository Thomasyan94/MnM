import { readdir, readFile, stat } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
const root = process.cwd();
async function walk(dir) {
  return (
    await Promise.all(
      (await readdir(dir, { withFileTypes: true })).map((e) =>
        e.isDirectory()
          ? walk(path.join(dir, e.name))
          : [path.join(dir, e.name)],
      ),
    )
  ).flat();
}
const files = [
  ...(await walk("src")),
  ...(await walk("scripts")),
  ...(await walk("experiments")),
  "index.html",
];
let references = 0;
for (const file of files) {
  const source = await readFile(file, "utf8");
  if (/\.(js|mjs)$/.test(file)) {
    const result = spawnSync(process.execPath, ["--check", file], {
      encoding: "utf8",
    });
    if (result.status !== 0) throw new Error(result.stderr);
  }
  const patterns =
    file.endsWith(".js") || file.endsWith(".mjs")
      ? [/from\s+['"]([^'"]+)['"]/g, /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g]
      : file.endsWith(".css")
        ? [/@import\s+['"]([^'"]+)['"]/g]
        : [/(?:src|href)=['"]([^'"#]+)['"]/g];
  for (const pattern of patterns)
    for (const match of source.matchAll(pattern)) {
      const target = match[1].split("?")[0];
      if (!target.startsWith(".") && !file.endsWith(".html")) continue;
      if (/^(https?:|data:|#)/.test(target)) continue;
      let resolved = path.resolve(path.dirname(file), target);
      if (!resolved.startsWith(root + path.sep))
        throw Error("Reference outside project: " + target);
      try {
        await stat(resolved);
      } catch {
        const publicPath = path.join(
          root,
          "public",
          path.relative(root, resolved),
        );
        await stat(publicPath);
      }
      references++;
    }
}
console.log("Syntax and " + references + " local source references passed.");
