# 糖尿病臨床導航

繁體中文臨床決策輔助網頁：診斷判讀、成人非孕期第 2 型糖尿病治療規劃、台灣健保給付條件核對與列印摘要。

## 使用範圍

- 適用醫療專業人員覆核；不是自動診斷、處方或健保核准工具。
- 急症、孕期、未成年及已知／疑似第 1 型糖尿病先分流。
- 表單只留在頁面記憶體，無後端、無儲存、無病人識別欄位。
- 不涵蓋完整藥物劑量、仿單禁忌或所有健保項目；未經前瞻性臨床驗證。

## 資料版本

查核日：2026-10-28。ADA Standards of Care 2026；ADA/EASD 2026-10-02 聯合共識；KDIGO 糖尿病 CKD 正式版仍為 2022，2026 為草案。

健保署藥品給付規定 115.10.22 文件：5.1（PDF 83–84 頁）與 2.16（48 頁）。5.1 通則修訂 2025-06-01；2.16 修訂 2025-03-01；各藥物依條款日期。含未來生效的其他章節不可直接視為已生效。

- https://professional.diabetes.org/standards-of-care
- https://doi.org/10.2337/dci26-0141
- https://www.nhi.gov.tw/ch/cp-13108-67ddf-2508-1.html
- https://www.nhi.gov.tw/ch/dl-100717-e456d68a6e9d4085b4ab7a2c7e37296a-1.pdf

## 開發與部署

原生 HTML/CSS/JavaScript ES modules；無需安裝依賴、無建置步驟、無獨立 lint 設定。

```sh
node --test tests.mjs
node --check dist/app.mjs
python3 -m http.server 8765 --directory dist
```

以 HTTP 開啟 `http://localhost:8765`，不使用 file:// 載入 ES modules。

部署目標：`yht5582-source/DM-guidelines`。GitHub Pages 使用 main 分支的 /docs 目錄。

`dist` 為編輯原始碼，發布前同步至 `docs`：

```sh
python3 -c "import shutil; shutil.copytree('dist', 'docs', dirs_exist_ok=True)"
```

測試涵蓋診斷確認、急症優先、特殊族群、腎功能界線、併用警示及健保邊界值。每次修改醫學規則時更新測試與來源日期。網頁未自動同步指引／健保公告。

`DM-guidelines.html` 為可直接開啟的單檔版本，內嵌相同 CSS 與 JavaScript，亦可單獨上傳作為靜態網站首頁。

驗證紀錄：39 項 Node 測試通過；ES module 與單檔腳本語法檢查通過。本機預覽伺服器因環境不允許綁定連接埠，尚未完成瀏覽器視覺／互動檢查。
