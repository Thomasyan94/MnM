import { cp, mkdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
const root = new URL("../", import.meta.url),
  dist = new URL("../dist/", import.meta.url);
await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
for (const file of ["index.html", "src", "experiments"])
  await cp(new URL(file, root), new URL(file, dist), { recursive: true });
for (const file of ["assets", "data"])
  await cp(new URL("public/" + file, root), new URL(file, dist), {
    recursive: true,
  });
console.log("Built " + fileURLToPath(dist));
