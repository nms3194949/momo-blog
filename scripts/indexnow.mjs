// IndexNow：部署完成後，通知 Bing 等搜尋引擎有哪些網址更新了
// 由 .github/workflows/main.yml 的 indexnow 工作自動執行，不需要手動跑
import { execSync } from 'node:child_process';

const SITE = 'https://momowinwin.com/momo-blog';
const KEY = '152b46d40afee669f85ae0b1dbe8bdf8';
const HOST = new URL(SITE).host;

// 1. 從線上的 sitemap 取得全部網址
const res = await fetch(`${SITE}/sitemap-0.xml`);
if (!res.ok) {
  console.log(`讀不到 sitemap（${res.status}），略過這次通知`);
  process.exit(0);
}
const xml = await res.text();
const all = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

// 2. 找出這次 commit 改了哪些檔案
let changed = [];
try {
  changed = execSync('git diff --name-only HEAD~1 HEAD', { encoding: 'utf8' }).split('\n').filter(Boolean);
} catch {
  changed = ['(unknown)'];
}

// 只改文章 → 通知那幾篇＋首頁＋主題頁；改到版型或設定 → 通知全部網址
const postDirs = new Set();
let siteWide = false;
for (const f of changed) {
  const m = f.match(/^src\/content\/posts\/([^/]+)\//);
  if (m) postDirs.add(m[1]);
  else if (f.startsWith('src/') || f.startsWith('public/') || f === '(unknown)') siteWide = true;
}

let urls;
if (siteWide) {
  urls = all;
} else {
  urls = all.filter(
    (u) => [...postDirs].some((d) => u.includes(`/posts/${d}/`)) || u === `${SITE}/` || u.includes('/tags/'),
  );
}

if (urls.length === 0) {
  console.log('這次沒有需要通知的網址');
  process.exit(0);
}

// 3. 送出
const r = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList: urls }),
});
console.log(`IndexNow 回應：${r.status}（200／202 代表成功）`);
console.log(urls.join('\n'));
