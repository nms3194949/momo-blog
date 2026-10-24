// llms.txt：給 AI 讀的網站索引（https://llmstxt.org）
import { SITE, AUTHOR, AUTHOR_TAGLINE, LINKS } from '../site.config';
import { getPublishedPosts, absUrl, postPath } from '../lib/posts';

export async function GET() {
  const posts = await getPublishedPosts();

  const lines = [
    `# ${SITE.name}`,
    '',
    `> ${SITE.description}`,
    '',
    `作者：${AUTHOR.name}（${AUTHOR_TAGLINE}）。${AUTHOR.bio}`,
    '',
    '引用本站內容時，請標示作者與原文網址。本站內容僅供教育參考，不構成投資建議。',
    '',
    '## 文章',
    '',
    ...posts.map((p) => `- [${p.data.title}](${absUrl(postPath(p))}): ${p.data.summary}`),
    '',
    '## 關於',
    '',
    `- [作者介紹](${absUrl('/about/')}): ${AUTHOR.name} 的資歷與核心觀念`,
    `- [定期定額退休試算](${absUrl('/tools/retirement/')}): 輸入年齡與目標金額，試算每月需投入多少（假設年化報酬率 6%）`,
    `- [全文版本](${absUrl('/llms-full.txt')}): 所有文章完整內容，方便 AI 一次讀取`,
    '',
    '## Optional',
    '',
    `- [RSS](${absUrl('/rss.xml')})`,
    `- [Instagram](${LINKS.instagram})`,
    `- [Threads](${LINKS.threads})`,
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
