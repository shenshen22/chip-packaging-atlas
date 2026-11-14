#!/usr/bin/env node
/** Validate content contracts and static paths before deploying to GitHub Pages. */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
const warn = [];
const check = (ok, label) => { if (!ok) failures.push(label); };
const valid = (value) => typeof value === "string" && value.trim().length > 0;
const files = ["index.html", "technology.html", "compare.html", "glossary.html", "about.html", "assets/app.js", "assets/styles.css", "assets/favicon.svg", "data/technologies.js", "AGENTS.md", "README.md"];
for (const file of files) check(fs.existsSync(path.join(root, file)), `缺少檔案：${file}`);

const context = { window: {} };
try { vm.runInNewContext(fs.readFileSync(path.join(root, "data/technologies.js"), "utf8"), context); }
catch (error) { failures.push(`無法讀取 technologies.js：${error.message}`); }

const data = context.window.CHIP_ATLAS_DATA;
check(data && Array.isArray(data.technologies), "缺少 technologies 陣列");
check(data && Array.isArray(data.glossary), "缺少 glossary 陣列");

if (data?.technologies && data?.glossary) {
  const categories = new Set(["封裝平台", "基礎封裝", "關鍵互連／製程"]);
  const difficulties = new Set(["入門", "中階", "進階"]);
  const diagrams = new Set(["interposer", "bridge", "stack", "fanout", "flipchip", "tsv", "rdl", "hybrid"]);
  const ids = new Set();
  const termIds = new Set(data.glossary.map(term => term.id));
  for (const term of data.glossary) {
    check(/^[a-z][a-z0-9-]*$/.test(term.id), `名詞 id 格式錯誤：${term.id}`);
    check(valid(term.en) && valid(term.zh) && valid(term.explain), `名詞缺少內容：${term.id}`);
  }
  check(termIds.size === data.glossary.length, "glossary 的 id 重複");
  for (const tech of data.technologies) {
    const prefix = `技術 ${tech.id || "(無 id)"}`;
    check(/^[a-z][a-z0-9-]*$/.test(tech.id || ""), `${prefix}：id 格式錯誤`);
    check(!ids.has(tech.id), `${prefix}：id 重複`);
    ids.add(tech.id);
    for (const field of ["name", "english", "owner", "category", "layout", "difficulty", "tagline", "summary", "solves"]) check(valid(tech[field]), `${prefix}：${field} 不完整`);
    check(categories.has(tech.category), `${prefix}：category 不在固定選項`);
    check(difficulties.has(tech.difficulty), `${prefix}：difficulty 不在固定選項`);
    check(diagrams.has(tech.diagram), `${prefix}：diagram 未實作`);
    check(Array.isArray(tech.steps) && tech.steps.length === 3 && tech.steps.every(valid), `${prefix}：steps 應恰好三步`);
    for (const field of ["strengths", "challenges", "questions"]) check(Array.isArray(tech[field]) && tech[field].length >= 2 && tech[field].every(valid), `${prefix}：${field} 至少兩項`);
    check(Array.isArray(tech.terms) && tech.terms.length >= 1 && tech.terms.every(term => termIds.has(term)), `${prefix}：terms 有無效名詞`);
    for (const field of ["placement", "route", "issue"]) check(valid(tech.compare?.[field]), `${prefix}：compare.${field} 不完整`);
    check(valid(tech.source?.label) && /^https:\/\/[^\s]+$/.test(tech.source?.url || ""), `${prefix}：來源網址不合法`);
    if (tech.tagline?.length > 65) warn.push(`${prefix}：tagline 較長，可能影響卡片高度`);
  }
  check(data.technologies.length >= 6, "技術條目不足六篇");
}

for (const file of files.filter(name => name.endsWith(".html"))) {
  if (!fs.existsSync(path.join(root, file))) continue;
  const html = fs.readFileSync(path.join(root, file), "utf8");
  check(/<main\b/.test(html), `${file}：缺少 main`);
  check(/data-page="[a-z]+"/.test(html), `${file}：缺少 data-page`);
  check(/assets\/app\.js/.test(html), `${file}：未引入共用程式`);
  const links = [...html.matchAll(/(?:href|src)="([^"#]+)"/g)].map(match => match[1]);
  for (const href of links) {
    if (/^(https?:|data:|mailto:)/.test(href)) continue;
    const pathname = href.split(/[?#]/)[0];
    if (!pathname) continue;
    check(fs.existsSync(path.join(root, pathname)), `${file}：相對資源不存在 ${pathname}`);
  }
}

console.log(`檢查 ${data?.technologies?.length || 0} 個技術、${data?.glossary?.length || 0} 個名詞、${files.filter(name => name.endsWith(".html")).length} 個 HTML 頁面`);
for (const item of warn) console.log(`WARN: ${item}`);
if (failures.length) {
  for (const item of failures) console.error(`ERROR: ${item}`);
  process.exitCode = 1;
} else {
  console.log("PASS: 資料欄位、分類、名稱、名詞關聯、來源格式與靜態路徑均符合 AGENTS.md 規則");
}
