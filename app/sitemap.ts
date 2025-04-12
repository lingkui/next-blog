import type { MetadataRoute } from 'next';
import { getLatestPublishedPosts } from '@/features/posts/queries';

export const runtime = 'edge';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getLatestPublishedPosts();

  return posts.map((post) => ({
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${post.slug}`,
    lastModified: post.publishedAt || undefined,
  }));
}
