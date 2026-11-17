# 新竹物流數位託運單 LINE LIFF 暨 Google Sheet 自動對帳系統

## 🎯 系統核心亮點（支援 LINE LIFF ＋ 一般網頁雙模式）

1. **LINE LIFF 專屬整合（免安裝、自動辨識寄件同仁）**：
   - **自動帶入同仁身分 (`liff.getProfile`)**：同仁在 LINE 點開 LIFF 連結時，若尚未自訂寄件人姓名，系統自動帶入 LINE 名稱（同仁可手動改為真名並勾選儲存於本機）；且寫入 Google Sheet 時會**雙重保障自動附註 `(LINE:名稱)`**，管理單位對帳 100% 找得到人！
   - **LINE 原生極速掃碼 (`liff.scanCodeV2`)**：在 LINE App 內點擊「📷 掃描物流貼紙QRCode」直接喚起 LINE 原生相機掃描器，秒讀貼紙 QR Code。
   - **零機密公開架構**：所有設定（`LIFF ID`、`GAS 網址`、`11碼客代`）皆由使用者首次啟用時儲存在設備本機（`localStorage`），不會出現在 GitHub 公開程式碼中。
   - **送出成功互動彈窗**：完成送出後彈出確認框，提供 **「➕ 繼續寄下一件」**、**「💬 發送寄件摘要到 LINE 聊天室」**、**「✅ 關閉視窗返回 LINE」** 三顆按鈕。

2. **貼近新竹物流原生 5 步驟介面（含本機記憶手寫簽名）**：
   - 內建全台 22 縣市 + 368 個鄉鎮市區與郵遞區號（0 秒瞬開選單）。
   - 步驟 5 提供手寫簽名板（Canvas），首次手寫送出後自動記憶於本機供下次直接帶出，並附有「🧹 清除重簽」按鈕。

3. **每月物流帳單自動對帳（Google Sheet 內建 `📊 新竹物流對帳` 選單）**：
   - 直接在 Google Sheet 上方選單上傳新竹物流每月對帳單（如 `6109812077 1174.xlsx`），自動雙向回填主表並建立 **`對帳_<請款書號碼>`** 分頁（含四種核對狀態標色、請款總額摘要、依寄件同仁運費分攤小計表）。

---

## 📱 如何申請與設定 LINE LIFF（僅需 2 分鐘）

1. 前往 [LINE Developers Console](https://developers.line.biz/console/)，選擇您的 Provider 與 **LINE Login Channel**（若只有 Messaging API Channel，可在同一 Provider 下新增一個 LINE Login Channel）。
2. 切換到 **「LIFF」** 頁籤，點擊 **「Add」** 新增一個 LIFF App：
   - **LIFF app name**：`新竹物流數位託運單`
   - **Size**：選擇 **`Full`**（全螢幕最佳體驗）
   - **Endpoint URL**：填入您的伺服器 HTTPS 網址（例如 `https://您的網域` 或 Cloudflare Tunnel 網址）
   - **Scopes**：勾選 **`profile`**、**`openid`**、**`chat_message.write`**（讓 LIFF 可讀取同仁名稱並發送寄件摘要至聊天室）
   - **Scan QR**：開啟 **`On`**（啟用 `liff.scanCodeV2` 原生掃碼器）
3. 建立後複製產生的 **`LIFF ID`**（格式如 `2000123456-AbCdEfGh`）。
4. 打開本系統網頁右上角 **「⚙️ 設定」**，填入 `LIFF ID`、`Google Apps Script 網址` 與 `11碼客代`，按 **「💾 儲存於此設備本機」**。
5. 將 **`https://liff.line.me/<您的LIFF_ID>`** 放到公司 LINE Bot 圖文選單或釘選在 LINE 群組公告，全公司同仁點開即可直接使用！
