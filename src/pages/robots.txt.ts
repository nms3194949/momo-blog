// robots.txt：明確歡迎搜尋引擎與 AI 爬蟲
import { absUrl } from '../lib/posts';

const AI_BOTS = [
  'GPTBot', // OpenAI 訓練
  'OAI-SearchBot', // ChatGPT 搜尋
  'ChatGPT-User', // ChatGPT 使用者即時瀏覽
  'ClaudeBot', // Anthropic
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended', // Gemini
  'Applebot-Extended',
  'Bingbot',
  'Googlebot',
];

export function GET() {
  const body = [
    ...AI_BOTS.flatMap((b) => [`User-agent: ${b}`, 'Allow: /', '']),
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${absUrl('/sitemap-index.xml')}`,
    '',
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
