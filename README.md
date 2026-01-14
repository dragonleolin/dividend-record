# Pixel Art Dividend Quest (配息冒險錄)

一個遊戲化、復古風格的股票配息追蹤網頁應用程式，整合 Google Sheets 作為資料庫。

## ✨ 特色
- 🎮 **復古美學**: 紅白機 (NES) 風格的像素藝術介面，搭配 `DotGothic16` 字體。
- 🧙‍♂️ **冒險指引**: 由「遊戲大師 (Game Master)」引導你完成配息紀錄。
- 📊 **Google Sheets 後端**: 資料安全地儲存在你自己的 Google 試算表中。
- 📱 **行動裝置友善**: 在手機上操作就像在玩掌上型遊戲機。

---

## 🚀 設定指南 (Setup Guide)

### 1. 前端安裝 (Frontend Installation)
請確認電腦已安裝 Node.js。

```bash
# 安裝相依套件
npm install

# 啟動本地開發伺服器
npm run dev
```

### 2. Google Sheets & Apps Script 設定 (後端)

本專案使用 Google Apps Script (GAS) 將資料儲存到你的 Google Sheet。

#### 步驟 A: 建立試算表
1. 建立一個新的 **Google Sheet**。
2. 命名為 `DividendQuest_DB` (或你喜歡的任何名稱)。
3. **不需要** 手動建立標題，程式會自動處理。

#### 步驟 B: 加入程式碼
1. 在 Google Sheet 中，點選上方選單的 **擴充功能 (Extensions)** > **Apps Script**。
2. 清空 `Code.gs` 中的所有內容，並複製本專案 `google-apps-script/Code.gs` 檔案中的完整程式碼貼上。  
3. 點選磁碟片圖示 **儲存 (Save)** 專案。

#### 步驟 C: 部署為網頁應用程式 (Web App)
1. 點選右上角的藍色 **部署 (Deploy)** 按鈕 > **新建部署 (New deployment)**。
2. 點選「選取類型」旁的齒輪圖示 > **網頁應用程式 (Web App)**。
3. **務必** 依照以下設定填寫：
    - **說明 (Description)**: `v1`
    - **執行身分 (Execute as)**: **我 (Me)** (你的 email)
    - **誰可以存取 (Who has access)**: **任何人 (Anyone)** -> *這點非常重要，這樣網頁才能寫入資料*。
4. 點選 **部署 (Deploy)**。
5. 系統會要求授權，點選 **授予存取權 (Authorize access)** > 選擇帳號 > **Advanced (進階)** > **Go to ... (unsafe) (前往...)** > **Allow (允許)**。

#### 步驟 D: 取得 API 網址
1. 複製 **網頁應用程式網址 (Web App URL)** (看起來像 `https://script.google.com/macros/s/.../exec`)。
2. 這就是你的 API 連結。

### 3. 連接前端與後端

找到 `src/components/PixelWizard.vue` 檔案中的 `GOOGLE_SCRIPT_URL` 變數，並填入你的網址：

```javascript
/* src/components/PixelWizard.vue */
const GOOGLE_SCRIPT_URL = '你的_WEB_APP_URL_貼在這裡'; 

// ...
```

### 4. 自動化部署到 GitHub Pages (Deployment)

本專案已設定好 GitHub Actions，只要將程式碼推送到 GitHub，就會自動部署。

#### 設定步驟：
1.  將本專案上傳到 GitHub Repository (建議命名為 `dividend-record`)。
2.  進入 GitHub Repository 的 **Settings (設定)** > **Pages**。
3.  在 **Build and deployment** > **Source** 選擇 **GitHub Actions**。
4.  程式碼推送到 `main` 分支後，Actions 就會自動開始並部署。
5.  部署完成後，你的網址通常會是：`https://<你的帳號>.github.io/dividend-record/`。

**注意**：
如果你的 Repository 名稱不是 `dividend-record`，請記得修改 `vite.config.js` 中的 `base` 設定：

```javascript
/* vite.config.js */
export default defineConfig({
  // ...
  base: '/你的-REPO-名稱/', 
})
```

---

## 📜 資料結構

程式會自動根據 **年份** (例如 "2026") 建立工作表。
欄位包含：
1.  **月份**
2.  **日期**
3.  **標的名稱**
4.  **金額**
5.  **股數/單位數**
6.  **月小計** (預留欄位)
7.  **備註**

## 🛠 技術棧
-   Vue 3 + Vite
-   Tailwind CSS (Pixel Art Config)
-   Google Apps Script
