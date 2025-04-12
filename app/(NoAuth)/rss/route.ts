import { getLatestPublishedPosts } from '@/features/posts/queries';
import { formatISO } from 'date-fns';

export const runtime = 'edge';

export async function GET() {
  const posts = await getLatestPublishedPosts();

  const xml = posts
    .map((post) => {
      return `
      <item>
        <title>${post.title}</title>
        <description>${post.excerpt}</description>
        <link>${process.env.NEXT_PUBLIC_BASE_URL}/posts/${post.slug}</link>
        <pubDate>${post.publishedAt ? formatISO(post.publishedAt) : ''}</pubDate>
      </item>
    `;
    })
    .join('\n');

  const rss = `
    <rss version="2.0">
      <channel>
        <title>Sunny's Blog</title>
        <description>Sunny's Blog RSS Feed</description>
        <link>${process.env.NEXT_PUBLIC_BASE_URL}</link>
        ${xml}
      </channel>
    </rss>
  `;

  return new Response(rss, {
    headers: {
      'Content-Type': 'text/xml',
    },
  });
}
