import { createDb } from '@/lib/db';
import { posts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const runtime = 'edge';

export const updatePostViews = async (slug: string) => {
  const db = createDb();
  const post = await db.query.posts.findFirst({ where: eq(posts.slug, slug) });

  if (!post) {
    return { error: 'Post not found' };
  }

  await db
    .update(posts)
    .set({ views: post.views + 1 })
    .where(eq(posts.slug, slug));

  return { success: 'Post views updated' };
};
