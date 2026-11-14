#!/usr/bin/env node
/** Copy the GitHub Pages-ready root site into dist for optional private preview hosting. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "dist");
fs.mkdirSync(output, { recursive: true });
for (const file of ["index.html", "technology.html", "compare.html", "glossary.html", "about.html"]) {
  fs.copyFileSync(path.join(root, file), path.join(output, file));
}
for (const folder of ["assets", "data"]) {
  fs.cpSync(path.join(root, folder), path.join(output, folder), { recursive: true, force: true });
}
console.log(`Build completed: ${output}`);
