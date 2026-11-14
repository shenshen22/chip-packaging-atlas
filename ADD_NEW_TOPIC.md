# 示範：下次如何新增一篇技術條目？

## 要交給 AI 的延伸指令

> 請先完整閱讀專案根目錄 `AGENTS.md`，再幫 Chip Packaging Atlas 新增一篇「Micro-bump（微凸塊）」技術介紹。你必須先確認它屬於哪個分類，並找出至少一份可查證的官方技術資料。請依照 `data/technologies.js` 既有物件的欄位格式新增，不要複製新的 HTML 頁面。完成後執行 `node scripts/validate.mjs`，並檢查首頁、技術詳情、比較器與來源連結，最後更新開發紀錄。若有不確定的數據，不要自行補上。

## AI 應依序做到

1. 先閱讀 `AGENTS.md`，找出第 5 節的必填欄位與分類標準。
2. 查證 Micro-bump 的定義、用途與已公開的資料來源。
3. 判斷它屬於「關鍵互連／製程」，而不是與 CoWoS 同一層級的封裝平台。
4. 在 `data/technologies.js` 加入唯一 `id`，例如 `micro-bump`，並完整填寫 `steps`、`questions` 等欄位。
5. 針對可重用示意圖先評估 `diagram: "flipchip"` 是否充分；若不足，再擴充 SVG 圖型。
6. 執行驗證並實際開啟 `technology.html?id=micro-bump`。
7. 在 `docs/DEVELOPMENT_LOG.md` 記錄修改內容與實測結果。

## 可延伸性的實際證據

由於卡片、條目內容、比較器下拉選單都從同一份 `technologies` 陣列讀取，因此只新增一筆符合規則的物件，三個頁面就能同步更新。

這正是本作業與上一次 Vibe Coding 的差別：**先建立長期規格，讓後續內容能依規格擴充**。
