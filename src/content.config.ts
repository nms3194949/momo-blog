import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * 每篇文章 = src/content/posts/<資料夾>/index.md
 * 資料夾名稱就是網址，例如 2026-10-dividend-source → /posts/2026-10-dividend-source/
 */
const posts = defineCollection({
  loader: glob({
    pattern: '**/index.md',
    base: './src/content/posts',
    generateId: ({ entry }) => entry.replace(/\/index\.md$/, ''),
  }),
  schema: ({ image }) =>
    z.object({
      /** 標題：建議寫成讀者會搜尋的問句或關鍵字 */
      title: z.string(),
      /** 一句話摘要（120 字內），搜尋結果與 AI 摘要會用到 */
      description: z.string().max(160),
      /** 文章開頭的「重點答案」，2–3 句話直接回答標題 */
      summary: z.string(),
      date: z.coerce.date(),
      /** 有大幅修改時填寫，AI 與 Google 會看「最後更新日期」 */
      updated: z.coerce.date().optional(),
      tags: z.array(z.string()).default([]),
      /** 對應的 IG 輪播貼文網址 */
      ig_url: z.string().url().optional(),
      /** 輪播圖（依順序），第一張會當作分享縮圖 */
      slides: z.array(image()).default([]),
      /** 輪播圖的替代文字（依順序），沒填會用「第 N 張」 */
      slide_alts: z.array(z.string()).default([]),
      /** 常見問題，會輸出成 FAQPage 結構化資料 */
      faq: z
        .array(z.object({ q: z.string(), a: z.string() }))
        .default([]),
      /** 資料來源（建議填，可大幅提高被 AI 引用的機率） */
      sources: z
        .array(z.object({ name: z.string(), url: z.string().url().optional() }))
        .default([]),
      /** 這篇文末 CTA 要用的 LINE 關鍵字，沒填就用網站預設 */
      line_keyword: z.string().optional(),
      /** true = 草稿，不會上線 */
      draft: z.boolean().default(false),
    }),
});

export const collections = { posts };
