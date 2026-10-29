// 排程發文檢查：找出「發布時間已到、但線上網站還沒有」的文章
// 由 .github/workflows/main.yml 每小時自動執行，不需要手動跑
// 輸出：due=文章資料夾名稱（逗號分隔），沒有就是空的
import { readdirSync, readFileSync, existsSync, appendFileSync } from 'node:fs';

const SITE = 'https://momowinwin.com/momo-blog';
const DIR = 'src/content/posts';
const now = Date.now();

const due = [];
for (const d of readdirSync(DIR)) {
  const f = `${DIR}/${d}/index.md`;
  if (!existsSync(f)) continue;
  const fm = readFileSync(f, 'utf8').split(/^---\s*$/m)[1] ?? '';
  if (/^draft:\s*true/m.test(fm)) continue;
  const m = fm.match(/^date:\s*['"]?([^'"\n]+)['"]?\s*$/m);
  if (!m) continue;
  const t = new Date(m[1].trim()).getTime();
  if (!Number.isNaN(t) && t <= now) due.push(d);
}

let live = '';
try {
  const r = await fetch(`${SITE}/sitemap-0.xml`);
  if (r.ok) live = await r.text();
} catch {}

// 讀不到線上 sitemap 時不動作，避免每小時重複部署
const missing = live ? due.filter((d) => !live.includes(`/posts/${d}/`)) : [];
console.log(missing.length ? `時間到、還沒上線的文章：${missing.join('、')}` : '沒有需要發布的排程文章');
if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `due=${missing.join(',')}\n`);
