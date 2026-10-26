// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// ============================================================
//  網址設定（二選一）
//
//  A. 先用 GitHub 免費網址（repo 名稱假設是 momo-blog）：
//     SITE_URL = 'https://momowinwin.com'
//     BASE     = '/momo-blog'
//
//  B. 綁定自有網域之後（建議）：
//     SITE_URL = 'https://www.你的網域.com'
//     BASE     = '/'
//     並把 public/CNAME 的內容改成你的網域
// ============================================================
const SITE_URL = 'https://momowinwin.com';
const BASE = '/momo-blog';

export default defineConfig({
  site: SITE_URL,
  base: BASE,
  trailingSlash: 'always',
  integrations: [sitemap()],
  build: {
    format: 'directory',
  },
});
