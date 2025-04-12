import * as schema from '@/lib/db/schema';
import { drizzle } from 'drizzle-orm/d1';

async function generateTestData(env: Env) {
  const db = drizzle(env.DB, { schema });

  const user = await db.query.users.findFirst();

  if (!user) {
    throw new Error('User not found');
  }

  // 清空现有数据
  await db.delete(schema.postsToTags).execute();
  await db.delete(schema.tags).execute();
  await db.delete(schema.posts).execute();

  // 创建一些测试标签
  const tags = await Promise.all(
    ['技术', '生活', '旅行', '美食', '编程', '设计'].map(async (name) => {
      const [tag] = await db
        .insert(schema.tags)
        .values({
          name,
          description: `关于${name}的标签`,
        })
        .returning();
      return tag;
    }),
  );

  // 创建测试文章
  for (let i = 0; i < 50; i++) {
    const isPublished = Math.random() > 0.5;
    const status = isPublished ? 'published' : 'draft';

    // 生成随机发布日期（过去一年内的随机日期）
    const now = new Date();
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    const randomDate = new Date(oneYearAgo.getTime() + Math.random() * (now.getTime() - oneYearAgo.getTime()));

    const post = await db
      .insert(schema.posts)
      .values({
        title: `测试文章 ${i}`,
        content: `这是第 ${i} 篇测试文章的内容。这里包含了一些示例文本，用于测试文章的功能。`,
        slug: `test-post-${i}-${Date.now()}`,
        status,
        authorId: user.id,
        excerpt: `这是第 ${i} 篇测试文章的摘要。`,
        cover: `https://picsum.photos/800/400?random=${i}`,
        views: Math.floor(Math.random() * 1000),
        publishedAt: isPublished ? randomDate : null,
      })
      .returning();

    // 为每篇文章随机分配 1-3 个标签
    const postTags = tags
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 3) + 1)
      .map((tag) => ({
        postId: post[0].id,
        tagId: tag.id,
      }));

    if (postTags.length > 0) {
      await db.insert(schema.postsToTags).values(postTags);
    }
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  async fetch(request: Request, env: Env) {
    if (request.method === 'GET') {
      await generateTestData(env);
      return new Response('Test data generated successfully', { status: 200 });
    }
    return new Response('Method not allowed', { status: 405 });
  },
};
