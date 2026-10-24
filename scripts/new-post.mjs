// 建立新文章：npm run new -- 2026-10-post05 "文章標題"
import { mkdirSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const [slug, title = '文章標題'] = process.argv.slice(2);
if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
  console.error('用法：npm run new -- <網址代稱> "標題"');
  console.error('網址代稱只能用小寫英文、數字、減號，例如 2026-10-post05');
  process.exit(1);
}

const dir = join('src', 'content', 'posts', slug);
if (existsSync(dir)) {
  console.error(`已經有這個資料夾：${dir}`);
  process.exit(1);
}
mkdirSync(dir, { recursive: true });

const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Taipei' });

writeFileSync(
  join(dir, 'index.md'),
  `---
title: "${title}"
description: "一句話摘要，120 字內，寫出讀者會搜尋的關鍵字"
summary: "重點答案：2–3 句話直接回答標題的問題。AI 最常引用這一段，請寫成可以單獨被引用的完整句子。"
date: ${today}
tags: [基金入門]
ig_url: https://www.instagram.com/p/REPLACE_ME/
# 放好圖片後，把下面兩段前面的 # 拿掉（圖片不存在時網站會建置失敗）
# slides:
#   - ./slide-01.png
#   - ./slide-02.png
# slide_alts:
#   - "第 1 張圖的重點文字"
#   - "第 2 張圖的重點文字"
faq:
  - q: 讀者會問的問題 1？
    a: 簡短完整的回答。
sources:
  - name: 資料來源名稱（例如 MoneyDJ，資料截至 2026/09）
    url: https://www.moneydj.com/
draft: true
---

## 小標題寫成讀者會問的問題？

每張輪播圖的重點，展開寫成一段文字。

## 第二個問題？

數據請註明「截至何時、來源是哪裡」。

## MOMO 的配置觀點

最後用你的觀點收尾。
`,
);

console.log(`✔ 已建立 ${dir}/index.md`);
console.log('  1. 把輪播圖 PNG 放進同一個資料夾，命名 slide-01.png、slide-02.png……');
console.log('  2. 填好內容後，把 draft: true 刪掉或改成 false 才會上線');
console.log('  3. npm run dev 預覽，沒問題就 git push');

const existing = readdirSync(join('src', 'content', 'posts')).length;
console.log(`  （目前共 ${existing} 篇）`);
