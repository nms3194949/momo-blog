# MOMO FinSphere 財商智庫｜文章網站

IG 輪播圖的網站版。每篇文章是一個資料夾，push 到 GitHub 後會自動上線。

---

## 一、第一次上線（約 20 分鐘）

1. **改設定**：打開 `src/site.config.ts`，把標註 `TODO` 的地方改掉
   - 官方 LINE 加好友網址
   - IG 帳號網址
   - 你的專業證照（AI 判斷內容可信度時會參考）
2. **換大頭照**：用你的照片取代 `public/avatar.png`（建議 256×256 正方形）
3. **建 repo**：在 GitHub 建立一個新 repo，名稱用 `momo-blog`（如果用別的名字，要同步修改 `astro.config.mjs` 的 `BASE`）
4. **上傳**：
   ```bash
   npm install
   git init && git add . && git commit -m "init"
   git branch -M main
   git remote add origin https://github.com/nms3194949/momo-blog.git
   git push -u origin main
   ```
5. **開啟 Pages**：到 repo 的 Settings → Pages → Source 選 **GitHub Actions**
6. 約 1 分鐘後，網站會出現在 `https://nms3194949.github.io/momo-blog/`

## 二、綁定自有網域（強烈建議）

`github.io/momo-blog` 這種子路徑網址有兩個缺點：`robots.txt` 不在網域根目錄，爬蟲讀不到；網站權威性也會算在 github.io 底下，不是你自己的資產。

1. 購買網域，DNS 建議放在 Cloudflare
2. DNS 加一筆 `CNAME`：`www` → `nms3194949.github.io`
3. 在 `public/` 建立一個名為 `CNAME` 的檔案，內容只寫一行 `www.你的網域.com`
4. 修改 `astro.config.mjs`：`SITE_URL = 'https://www.你的網域.com'`，`BASE = '/'`
5. 到 GitHub Settings → Pages 填入網域，並勾選 Enforce HTTPS

## 三、上線後要做的登錄（一次性）

- **Google Search Console**：驗證網域並提交 `sitemap-index.xml`
- **Bing Webmaster Tools**：可以直接從 Google Search Console 匯入。ChatGPT 搜尋大量使用 Bing 的索引，這一步不能省
- （選用）**GA4** 或 **Cloudflare Web Analytics**：如果要加，把追蹤碼貼進 `src/layouts/BaseLayout.astro` 的 `<head>`

---

## 四、每週發文流程（約 5 分鐘）

```bash
npm run new -- 2026-10-post05 "月配息基金怎麼挑？"
```

這行指令會建立 `src/content/posts/2026-10-post05/index.md`，接著：

1. 把這篇的輪播圖 PNG 放進同一個資料夾，命名為 `slide-01.png`、`slide-02.png`……
2. 填寫 `index.md`（欄位說明見下表），並刪除 `draft: true`
3. 執行 `npm run dev`，打開 http://localhost:4321/momo-blog/ 預覽
4. 確認沒問題後執行 `git add . && git commit -m "post05" && git push`，約 1 分鐘後上線

> 資料夾名稱就是文章網址，發布後就不要再改。網址改了，Google 和 AI 累積的引用就會失效。

### 欄位說明

| 欄位 | 用途 | GEO 重點 |
|---|---|---|
| `title` | 標題 | 寫成讀者會搜尋的問句 |
| `description` | 搜尋結果摘要 | 120 字內，包含關鍵字 |
| `summary` | 文章開頭的「重點答案」 | **最重要**：2–3 句直接回答標題，AI 最常引用這一段 |
| `slides` / `slide_alts` | 輪播圖與替代文字 | alt 寫入圖片上的重點文字 |
| `faq` | 常見問題 | 會自動輸出 FAQPage 結構化資料 |
| `sources` | 資料來源 | 註明來源和資料日期，可以提高被引用的機率 |
| `ig_url` | 對應的 IG 貼文 | 文末會出現「看 IG 輪播版」按鈕 |
| `line_keyword` | LINE 關鍵字 | 文末顯示「LINE 輸入『關鍵字』」 |
| `updated` | 最後更新日 | 有大幅修改時再填 |

### 內文寫法

- 用 `##` 小標題，寫成讀者會問的問題
- 每張輪播圖的重點，展開寫成一段文字（AI 看不懂圖片裡的字）
- 數據一律註明「截至何時、來源是哪裡」
- 最後用「MOMO 的配置觀點」收尾
- 避免「保證」「穩賺」、推薦特定商品等用語，免責聲明已經自動放在每一頁頁尾

---

## 五、網站自動處理的事（不需要動）

| 功能 | 說明 |
|---|---|
| 結構化資料 | 每篇自動產生 BlogPosting、FAQPage、BreadcrumbList；全站帶 Person（作者資歷）與 WebSite |
| `/llms.txt` | 給 AI 讀的網站索引，每篇附重點答案 |
| `/llms-full.txt` | 全站文章純文字版，AI 可以一次讀完 |
| `/robots.txt` | 明確允許 GPTBot、ClaudeBot、PerplexityBot、Google-Extended 等爬蟲 |
| `/sitemap-index.xml`、`/rss.xml` | 自動更新 |
| 分享縮圖 | 自動使用第一張輪播圖 |
| 圖片壓縮 | 自動轉 WebP 並產生多種尺寸 |
| 導流 | 手機底部固定 LINE 按鈕、文末 CTA，所有連結自動帶 UTM（`utm_source=website`） |
| 免責聲明 | 每頁頁尾，內容在 `site.config.ts` 修改 |

## 六、檔案結構

```
src/
├── site.config.ts          ← 網站設定（LINE、IG、作者、免責聲明）
├── content/posts/          ← 文章（一篇一個資料夾）
├── pages/                  ← 頁面與 llms.txt、robots.txt、RSS
├── components/             ← 輪播圖、CTA、底部導流列
├── layouts/BaseLayout.astro← 共用版型與 SEO 標籤
└── styles/global.css       ← 配色（米白 × 海軍藍 × 香檳金）
scripts/new-post.mjs        ← 新增文章指令
.github/workflows/deploy.yml← 自動部署
```
