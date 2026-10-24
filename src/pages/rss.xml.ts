import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE } from '../site.config';
import { getPublishedPosts, url, postPath } from '../lib/posts';

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts();
  return rss({
    title: SITE.name,
    description: SITE.description,
    site: new URL(url('/'), context.site!).toString(),
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.summary,
      pubDate: p.data.date,
      link: url(postPath(p)),
      categories: p.data.tags,
    })),
    customData: `<language>zh-tw</language>`,
  });
}
