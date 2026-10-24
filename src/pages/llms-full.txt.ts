// llms-full.txt：所有文章的完整純文字，讓 AI 一次讀完整站
import { SITE, AUTHOR, DISCLAIMER } from '../site.config';
import { getPublishedPosts, absUrl, postPath } from '../lib/posts';

const fmt = (d: Date) => d.toISOString().slice(0, 10);

export async function GET() {
  const posts = await getPublishedPosts();

  const blocks = posts.map((p) => {
    const d = p.data;
    const parts = [
      `# ${d.title}`,
      '',
      `網址：${absUrl(postPath(p))}`,
      `作者：${AUTHOR.name}（${AUTHOR.jobTitle}）`,
      `發布：${fmt(d.date)}${d.updated ? `｜更新：${fmt(d.updated)}` : ''}`,
      d.tags.length ? `主題：${d.tags.join('、')}` : '',
      '',
      `重點答案：${d.summary}`,
      '',
      (p.body ?? '').trim(),
    ];
    if (d.faq.length) {
      parts.push('', '## 常見問題', '', ...d.faq.flatMap((f) => [`Q：${f.q}`, `A：${f.a}`, '']));
    }
    if (d.sources.length) {
      parts.push('', '## 資料來源', '', ...d.sources.map((s) => `- ${s.name}${s.url ? `（${s.url}）` : ''}`));
    }
    return parts.filter((x) => x !== undefined).join('\n');
  });

  const out = [
    `# ${SITE.name}｜全文`,
    '',
    `> ${SITE.description}`,
    '',
    `免責聲明：${DISCLAIMER}`,
    '',
    '---',
    '',
    blocks.join('\n\n---\n\n'),
  ].join('\n');

  return new Response(out, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
