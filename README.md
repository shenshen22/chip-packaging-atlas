# Chip Packaging Atlas｜先進封裝技術圖鑑

一個可持續擴充的繁體中文先進封裝知識網站，用圖解、工程問題和雙欄比較，協助初學者理解先進封裝技術。

## 專案用途

- 理解 CoWoS、InFO、SoIC、EMIB、Foveros 等**封裝平台**。
- 認識 Flip-Chip、Fan-Out 等**基礎封裝**。
- 區別 TSV、RDL、Hybrid Bonding 等**互連／製程技術**。
- 透過「技術比較器」建立結構和工程挑戰的比較觀念。
- 使用 `AGENTS.md` 讓 AI 能依一致規格新增內容。

目前示範 10 項技術條目、12 個專有名詞，網站完全靜態，不需要 API Key、資料庫、帳號或建置框架。

## 主要功能

| 頁面 | 網站功能 |
| --- | --- |
| `index.html` | 依類別篩選、關鍵字搜尋、學習路徑 |
| `technology.html?id=cowos` | 結構示意、原理、優勢／限制、研究問題、官方資料來源、收藏 |
| `compare.html` | 任選兩項技術並排比較、交換 A/B，網址可分享 |
| `glossary.html` | 中英名詞搜尋，技術頁可直接連入 |
| `about.html` | 專案目的、查證方式與可擴充設計 |

「收藏」只存在訪客自己的瀏覽器 Local Storage，不會上傳資料。

## 直接使用

1. 下載此專案 ZIP 並解壓縮。
2. 用瀏覽器開啟根目錄的 `index.html` 即可（不需要 Python / Node 伺服器）。
3. 若想改網站內容，閱讀 `AGENTS.md` 與 `docs/ADD_NEW_TOPIC.md`。

## 發布到 GitHub Pages

1. 登入 GitHub，建立 Public Repository，名稱建議 `chip-packaging-atlas`。
2. 在 Repository 選 `Add file` → `Upload files`，**將 ZIP 解壓縮後 `chip-packaging-atlas` 資料夾「裡面的檔案與資料夾」全部上傳**。請確認 `index.html` 位於 Repository 最外層。
3. 在 `Settings` → `Pages`：`Build and deployment` 選 `Deploy from a branch`，Branch 選 `main`，Folder 選 `/(root)`，按 `Save`。
4. GitHub Pages 發布完成後，網站網址通常是 `https://你的帳號.github.io/chip-packaging-atlas/`。**請以 GitHub Settings → Pages 顯示的實際網址為準。**
5. 用無痕視窗開啟公開網址，實測首頁、技術條目、比較器、名詞表。

> 若你的 GitHub Repo 設為 Private，GitHub Pages 可用性與公開權限受帳號方案及設定影響；本作業建議使用 Public Repo，並檢查頁面能以無痕模式開啟。

## 資料架構

`data/technologies.js` 是唯一內容來源。新增一筆物件會同步出現在首頁卡片、詳細頁以及比較器，不需要複製 HTML。

```text
data/technologies.js
      │
      ├── index.html → 搜尋、篩選、卡片
      ├── technology.html?id=... → 詳細技術頁
      ├── compare.html → A/B 技術對照
      └── glossary.html → glossary 陣列名詞
```

核心更新規則請閱讀 [`AGENTS.md`](AGENTS.md)。新增示例請閱讀 [`docs/ADD_NEW_TOPIC.md`](docs/ADD_NEW_TOPIC.md)。

## 驗證

只要有安裝 Node.js，可於專案根目錄執行：

```bash
node scripts/validate.mjs
```

腳本會檢查：資料欄位、ID 唯一、分類、名詞表連結、來源網址、HTML 與相對資源路徑。

## 來源與說明

內容以 TSMC 3DFabric、Intel Foundry、ASE、imec 等公開技術資料為基礎；每篇條目附上來源連結。示意圖是概念教學圖，不代表真實製程截面或相對比例。技術更新時以最新官方資訊為準。

## AI 協作揭露

使用生成式 AI 協助網站資訊架構、程式實作、`AGENTS.md` 編寫及文字初稿。實際交作業前，使用者應閱讀並確認內容與來源，實際測試 GitHub Pages 網址，並保留 Prompt 與生成成果的真實對話截圖；不得將未進行的人工查證或測試寫成已完成。
