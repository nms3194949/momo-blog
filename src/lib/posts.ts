import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

/** 已發布文章，新到舊 */
export async function getPublishedPosts(): Promise<Post[]> {
  const all = await getCollection('posts', ({ data }) => !data.draft);
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** 站內連結：自動加上 base 路徑 */
export function url(path = '/'): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}

/** 完整網址（給結構化資料、RSS、llms.txt 用） */
export function absUrl(path = '/'): string {
  return new URL(url(path), import.meta.env.SITE).toString();
}

export function postPath(post: Post): string {
  return `/posts/${post.id}/`;
}

export function tagPath(tag: string): string {
  return `/tags/${encodeURIComponent(tag)}/`;
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Taipei',
  });
}

export function isoDate(d: Date): string {
  return d.toISOString();
}

/** 所有標籤與篇數 */
export function collectTags(posts: Post[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const p of posts) for (const t of p.data.tags) m.set(t, (m.get(t) ?? 0) + 1);
  return new Map([...m.entries()].sort((a, b) => b[1] - a[1]));
}
