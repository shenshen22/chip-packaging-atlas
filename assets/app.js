/* Chip Packaging Atlas — no framework, no API key, no tracking. */
(function () {
  "use strict";

  const atlas = window.CHIP_ATLAS_DATA;
  const page = document.body.dataset.page;
  const $ = (selector, root = document) => root.querySelector(selector);
  const safe = (value) => String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  const lookup = (id) => atlas.technologies.find(item => item.id === id);

  function renderShared() {
    const links = [
      ["home", "圖鑑首頁", "index.html"], ["compare", "技術比較", "compare.html"],
      ["glossary", "名詞表", "glossary.html"], ["about", "關於專案", "about.html"]
    ];
    const skipTarget = page === "technology" ? "#technology-main" : "#main-content";
    $("#site-header").innerHTML = `
      <a class="skip-link" href="${skipTarget}">跳至主要內容</a>
      <header class="site-header"><div class="container header-inner">
        <a class="brand" href="index.html" aria-label="Chip Packaging Atlas 回首頁"><span class="brand-mark" aria-hidden="true"></span><span class="brand-name">CHIP PACKAGING<small>ATLAS / 封裝圖鑑</small></span></a>
        <button class="menu-toggle" type="button" aria-controls="main-nav" aria-expanded="false">☰ 選單</button>
        <nav class="main-nav" id="main-nav" aria-label="主選單">${links.map(([id, label, href]) => `<a href="${href}" ${page === id ? 'aria-current="page"' : ""}>${label}</a>`).join("")}</nav>
        <a class="nav-action" href="index.html#explore">探索技術 ↗</a>
      </div></header>`;
    $("#site-footer").innerHTML = `<footer class="site-footer"><div class="container">
      <div class="footer-inner"><div><div class="footer-title">Chip Packaging Atlas<small>AN OPEN LEARNING PROJECT</small></div><p style="font-size:12px;color:#a8bcc4;max-width:400px;margin-top:16px">先進封裝概念、技術比較與研究問題的可擴充知識網站。</p></div>
      <div class="footer-links"><a href="index.html#explore">圖鑑</a><a href="compare.html">技術比較</a><a href="glossary.html">名詞表</a><a href="about.html">關於</a></div></div>
      <div class="footer-note"><span>© Chip Packaging Atlas · Educational project</span><span>技術示意非比例工程圖；內容以官方來源為查證依據。</span></div>
    </div></footer>`;
    const main = $("main");
    if (main && !main.id) main.id = "main-content";
    $(".menu-toggle").addEventListener("click", event => {
      const opened = $(".site-header").classList.toggle("open");
      event.currentTarget.setAttribute("aria-expanded", String(opened));
      event.currentTarget.textContent = opened ? "✕ 關閉" : "☰ 選單";
    });
  }

  // 教學示意：使用固定 SVG 元素，沒有任何未經驗證的尺寸或比例。
  function diagram(type, ariaLabel = "封裝結構示意圖") {
    const chip = (x, y, w, h, secondary = false) => `<rect class="chip${secondary ? " secondary" : ""}" x="${x}" y="${y}" width="${w}" height="${h}" rx="4"/>`;
    const bump = (x, y, n, gap = 19) => Array.from({ length: n }, (_, i) => `<circle class="metal" cx="${x + gap * i}" cy="${y}" r="5"/>`).join("");
    const base = `<rect class="substrate" x="40" y="149" width="320" height="35" rx="3"/><text class="label tiny" x="200" y="171" text-anchor="middle">PACKAGE SUBSTRATE</text>`;
    let inside = "";
    switch (type) {
      case "interposer":
        inside = `${chip(72,45,112,72)}${chip(229,54,98,63,true)}${bump(86,124,6,19)}${bump(245,124,4,20)}<rect class="routing" x="54" y="130" width="292" height="21" rx="2"/><path class="guide" d="M93 139H305"/>${base}<text class="label tiny" x="200" y="144" text-anchor="middle">INTERPOSER</text>`;
        break;
      case "bridge":
        inside = `${chip(72,54,119,73)}${chip(220,54,110,73,true)}${bump(84,133,6,17)}${bump(232,133,6,17)}${base}<rect class="routing" x="167" y="133" width="70" height="16" rx="2"/><path class="line-metal" d="M183 140H222"/><text class="label tiny" x="200" y="32" text-anchor="middle">LOCAL SILICON BRIDGE</text>`;
        break;
      case "stack":
        inside = `${chip(118,33,164,45,true)}${bump(135,85,8,18)}${chip(96,91,209,46)}${bump(120,142,10,17)}${base}<text class="label tiny" x="200" y="23" text-anchor="middle">DIE STACKING</text>`;
        break;
      case "fanout":
        inside = `<rect class="mold" x="61" y="66" width="280" height="74" rx="6"/>${chip(140,75,120,51)}<path class="line-metal" d="M170 140V148H89M229 140V148H312"/>${bump(91,156,12,20)}<rect class="routing" x="61" y="161" width="280" height="14" rx="2"/><text class="label tiny" x="200" y="49" text-anchor="middle">DIE + FAN-OUT REGION</text>`;
        break;
      case "flipchip":
        inside = `${chip(106,44,190,80)}${bump(124,132,9,19)}${base}<text class="label tiny" x="200" y="29" text-anchor="middle">ACTIVE SIDE FACING DOWN</text>`;
        break;
      case "tsv":
        inside = `<rect class="chip" x="103" y="49" width="195" height="102" rx="5"/><rect class="metal" x="147" y="50" width="15" height="99" rx="3"/><rect class="metal" x="238" y="50" width="15" height="99" rx="3"/><path class="guide" d="M154 24V49M245 24V49"/><text class="label tiny" x="200" y="29" text-anchor="middle">THROUGH SILICON VIA</text>${base}`;
        break;
      case "rdl":
        inside = `${chip(130,42,138,79)}<path class="line-metal" d="M155 128V139H83V156M240 128V139H318V156"/>${bump(82,162,3,118)}<rect class="routing" x="61" y="173" width="280" height="12" rx="2"/><text class="label tiny" x="200" y="28" text-anchor="middle">REDISTRIBUTED CONNECTIONS</text>`;
        break;
      case "hybrid":
        inside = `${chip(112,38,180,68,true)}${chip(112,113,180,67)}<rect class="routing" x="112" y="106" width="180" height="7"/><path d="M148 106v7m34-7v7m34-7v7m34-7v7" stroke="#b98540" stroke-width="9"/><text class="label tiny" x="200" y="25" text-anchor="middle">BONDED INTERFACE</text>`;
        break;
      default:
        inside = `${chip(92,65,218,70)}${bump(110,142,10,20)}${base}`;
    }
    return `<svg class="tech-diagram" viewBox="0 0 400 210" role="img" aria-label="${safe(ariaLabel)}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="400" height="210" fill="transparent"/><path class="guide" d="M25 190H375"/>${inside}</svg>`;
  }

  function renderCard(tech) {
    return `<a class="tech-card" href="technology.html?id=${safe(tech.id)}" aria-label="查看 ${safe(tech.name)} 技術介紹">
      <div class="card-top"><span class="category-tag">${safe(tech.category)}</span><span class="layout-tag">${safe(tech.layout)}</span></div>
      <div class="card-figure">${diagram(tech.diagram, tech.name + " 示意結構")}</div>
      <h3>${safe(tech.name)}</h3><div class="english-name">${safe(tech.english)}</div>
      <p class="card-summary">${safe(tech.tagline)}</p>
      <div class="card-footer"><small>${safe(tech.owner)} · ${safe(tech.difficulty)}</small><span>閱讀條目 ↗</span></div></a>`;
  }

  function renderHome() {
    const types = ["全部", "封裝平台", "基礎封裝", "關鍵互連／製程"];
    let category = "全部";
    const buttons = $("#category-filters");
    buttons.innerHTML = types.map((type, i) => `<button type="button" data-category="${safe(type)}" class="${i === 0 ? "active" : ""}" aria-pressed="${i === 0}">${safe(type)}</button>`).join("");
    const search = $("#tech-search");
    function update() {
      const query = search.value.trim().toLocaleLowerCase();
      const items = atlas.technologies.filter(item => {
        const matchesCategory = category === "全部" || item.category === category;
        const haystack = [item.name, item.english, item.category, item.layout, item.tagline, item.summary, ...item.terms].join(" ").toLocaleLowerCase();
        return matchesCategory && haystack.includes(query);
      });
      $("#tech-grid").innerHTML = items.map(renderCard).join("");
      $("#result-count").textContent = `顯示 ${items.length} / ${atlas.technologies.length} 項`;
      $("#no-results").hidden = items.length !== 0;
    }
    buttons.addEventListener("click", event => {
      const button = event.target.closest("button[data-category]");
      if (!button) return;
      category = button.dataset.category;
      buttons.querySelectorAll("button").forEach(b => {
        const current = b === button;
        b.classList.toggle("active", current);
        b.setAttribute("aria-pressed", String(current));
      });
      update();
    });
    search.addEventListener("input", update);
    const initialSearch = new URLSearchParams(location.search).get("q");
    if (initialSearch) search.value = initialSearch;
    update();
  }

  function listItems(items, warn = false) {
    return `<ul class="bullets${warn ? " warn" : ""}">${items.map(item => `<li>${safe(item)}</li>`).join("")}</ul>`;
  }

  function getBookmarks() {
    try {
      const items = JSON.parse(localStorage.getItem("chip-atlas-bookmarks") || "[]");
      return Array.isArray(items) ? items.filter(item => typeof item === "string") : [];
    } catch { return []; }
  }

  function renderDetail() {
    const id = new URLSearchParams(location.search).get("id") || "cowos";
    const tech = lookup(id);
    const root = $("#technology-main");
    if (!tech) {
      root.innerHTML = `<div class="error-message"><h1>找不到這項技術</h1><p>請檢查網址參數，或回到圖鑑重新選擇。</p><a class="btn btn-dark" href="index.html#explore">回圖鑑 ↗</a></div>`;
      document.title = "找不到條目｜Chip Packaging Atlas";
      return;
    }
    document.title = `${tech.name}｜Chip Packaging Atlas`;
    const index = atlas.technologies.indexOf(tech);
    const previous = atlas.technologies[(index - 1 + atlas.technologies.length) % atlas.technologies.length];
    const next = atlas.technologies[(index + 1) % atlas.technologies.length];
    const bookmarked = getBookmarks().includes(tech.id);
    root.innerHTML = `<a class="back-link" href="index.html#explore">← 回到技術圖鑑</a>
      <section class="detail-hero"><div class="detail-labels"><span>${safe(tech.category)}</span><span>${safe(tech.layout)}</span><span>${safe(tech.difficulty)}</span></div>
        <h1>${safe(tech.name)}</h1><div class="detail-english">${safe(tech.english)}</div><p class="detail-tagline">${safe(tech.tagline)}</p>
        <div class="detail-hero-bottom"><small>${safe(tech.owner)} / TECH NOTE ${String(index + 1).padStart(2, "0")}</small><button type="button" class="bookmark-button" id="bookmark-button" aria-pressed="${bookmarked}">${bookmarked ? "★ 已收藏" : "☆ 收藏條目"}</button></div></section>
      <div class="detail-layout"><div class="detail-main">
        <section class="detail-panel"><p class="overline">CONCEPT / 01</p><h2>這是什麼技術？</h2><p>${safe(tech.summary)}</p></section>
        <section class="detail-panel"><p class="overline">STRUCTURE / 02</p><h2>概念結構示意</h2><div class="diagram-frame">${diagram(tech.diagram, tech.name + " 概念結構示意")}</div><p class="diagram-disclaimer">示意圖僅用於理解連接關係；非比例、非廠商實際製程剖面。</p></section>
        <section class="detail-panel"><p class="overline">PROCESS / 03</p><h2>原理拆解</h2><ol class="process-list">${tech.steps.map(step => `<li>${safe(step)}</li>`).join("")}</ol></section>
        <section class="detail-panel"><p class="overline">ENGINEERING VIEW / 04</p><h2>技術優勢與工程限制</h2><h3 style="font-size:15px;margin:19px 0 7px">值得關注的優勢</h3>${listItems(tech.strengths)}<h3 style="font-size:15px;margin:24px 0 7px">需要解決的挑戰</h3>${listItems(tech.challenges, true)}</section>
      </div><aside class="detail-side" aria-label="研究筆記與相關連結">
        <section class="detail-panel"><p class="overline">THE WHY</p><h2>它解決什麼問題？</h2><p>${safe(tech.solves)}</p></section>
        <section class="detail-panel"><p class="overline">RESEARCH QUESTIONS</p><h2>換成 RD 的角度</h2><div class="question-list">${tech.questions.map(q => `<p>${safe(q)}</p>`).join("")}</div></section>
        <section class="detail-panel"><p class="overline">KEY TERMS</p><h2>延伸名詞</h2><div class="pill-links">${tech.terms.map(id => {const term = atlas.glossary.find(g => g.id === id); return term ? `<a href="glossary.html?term=${encodeURIComponent(term.en)}">${safe(term.en)} ↗</a>` : "";}).join("")}</div></section>
        <section class="detail-panel"><p class="overline">REFERENCE</p><h2>資料來源</h2><p>此頁為學習整理。建議閱讀來源頁面，確認各技術版本的最新差異。</p><a class="source-link" href="${safe(tech.source.url)}" target="_blank" rel="noopener noreferrer">${safe(tech.source.label)} ↗</a></section>
      </aside></div><nav class="detail-nav" aria-label="其他技術"><a href="technology.html?id=${safe(previous.id)}">← 上一篇：${safe(previous.name)}</a><a href="technology.html?id=${safe(next.id)}">下一篇：${safe(next.name)} →</a></nav>`;
    $("#bookmark-button").addEventListener("click", event => {
      const list = getBookmarks();
      const found = list.includes(tech.id);
      const updated = found ? list.filter(id => id !== tech.id) : [...list, tech.id];
      try { localStorage.setItem("chip-atlas-bookmarks", JSON.stringify(updated)); } catch { /* private browsing */ }
      event.currentTarget.setAttribute("aria-pressed", String(!found));
      event.currentTarget.textContent = !found ? "★ 已收藏" : "☆ 收藏條目";
    });
  }

  function renderCompare() {
    const left = $("#compare-left"), right = $("#compare-right");
    const options = atlas.technologies.map(t => `<option value="${safe(t.id)}">${safe(t.name)} — ${safe(t.category)}</option>`).join("");
    left.innerHTML = options;
    right.innerHTML = options;
    const url = new URL(location.href);
    const initialLeft = url.searchParams.get("a"), initialRight = url.searchParams.get("b");
    left.value = lookup(initialLeft) ? initialLeft : "cowos";
    right.value = lookup(initialRight) ? initialRight : "emib";
    function update() {
      const a = lookup(left.value), b = lookup(right.value);
      if (!a || !b) return;
      const card = (tech, label) => `<article class="compare-card"><div class="comparison-eyebrow">${label} / ${safe(tech.category)}</div><h2>${safe(tech.name)}</h2><div class="compare-en">${safe(tech.english)}</div><div class="diagram-frame">${diagram(tech.diagram, tech.name + " 示意圖")}</div><p style="font-size:14px;color:#5d6d74;line-height:1.85">${safe(tech.tagline)}</p><a class="text-link" href="technology.html?id=${safe(tech.id)}">閱讀完整介紹 ↗</a></article>`;
      const rows = [
        ["技術層級", a.category, b.category], ["結構類型", a.layout, b.layout],
        ["晶片配置", a.compare.placement, b.compare.placement], ["主要連線", a.compare.route, b.compare.route],
        ["工程關注", a.compare.issue, b.compare.issue], ["主要目的", a.solves, b.solves]
      ];
      $("#comparison-output").innerHTML = `<div class="compare-grid">${card(a, "TECH A")}${card(b, "TECH B")}</div><div class="comparison-table" role="table" aria-label="技術差異比較">${rows.map(row => row.map(text => `<div role="cell">${safe(text)}</div>`).join("")).join("")}</div>`;
      url.searchParams.set("a", a.id); url.searchParams.set("b", b.id);
      try { history.replaceState(null, "", url.pathname + url.search); } catch { /* file:// local viewing */ }
    }
    left.addEventListener("change", update);
    right.addEventListener("change", update);
    $("#swap-button").addEventListener("click", () => { [left.value, right.value] = [right.value, left.value]; update(); });
    update();
  }

  function renderGlossary() {
    const input = $("#glossary-search");
    const fromUrl = new URLSearchParams(location.search).get("term");
    if (fromUrl) input.value = fromUrl;
    function update() {
      const q = input.value.trim().toLocaleLowerCase();
      const matches = atlas.glossary.filter(t => [t.en, t.zh, t.explain].join(" ").toLocaleLowerCase().includes(q));
      $("#glossary-grid").innerHTML = matches.map(t => `<article class="glossary-card" id="${safe(t.id)}"><strong>${safe(t.en)}</strong><span class="glossary-zh">${safe(t.zh)}</span><p>${safe(t.explain)}</p></article>`).join("");
      $("#glossary-empty").hidden = matches.length !== 0;
    }
    input.addEventListener("input", update);
    update();
  }

  if (!atlas || !Array.isArray(atlas.technologies)) {
    document.body.innerHTML = '<main class="container"><h1>無法載入技術資料</h1><p>請確認 data/technologies.js 是否存在。</p></main>';
    return;
  }
  renderShared();
  if (page === "home") renderHome();
  if (page === "technology") renderDetail();
  if (page === "compare") renderCompare();
  if (page === "glossary") renderGlossary();
})();
