# IG 待處理區

IG 自動回應的 GAS（Auto_BlogSync.gs）每 30 分鐘檢查一次 IG 新貼文，
把每篇貼文放成一個資料夾：`content-plan/ig-inbox/<IG 短碼>/`

- `slide-01.jpg`、`slide-02.jpg`…：輪播圖（單張圖卡只有一張）
- `meta.json`：貼文 ID、網址、發佈時間、類型、留言關鍵字
- `info.txt`：IG 文案全文＋貼文網址（最後寫入；有這個檔案才代表同步完成）

排程任務（每天）會把這裡的貼文轉成部落格文章（src/content/posts/），
完成後刪掉該資料夾。這個資料夾的變動不會觸發網站部署。
