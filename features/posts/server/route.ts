import { createDb } from '@/lib/db';
import { posts, postsToTags, tags } from '@/lib/db/schema';
import { createErrorHandler } from '@/lib/error-handler';
import { sessionMiddleware } from '@/lib/session-middleware';
import { zValidator } from '@hono/zod-validator';
import { and, count, desc, eq, getTableColumns, inArray } from 'drizzle-orm';
import { Hono } from 'hono';
import { createPostSchema, getPostsSchema, updatePostStatusSchema } from '../schemas';
import { PostStatus } from '../types';

export const runtime = 'edge';

// 创建带有自定义消息的错误处理器
const { handleDatabaseError } = createErrorHandler({
  uniqueConstraint: (field) => {
    switch (field) {
      case 'slug':
        return 'This slug is already in use. Please choose a different one.';
      default:
        return 'This value already exists. Please try a different one.';
    }
  },
});

const app = new Hono()
  .get('/', zValidator('query', getPostsSchema), async (c) => {
    const { page, size } = c.req.valid('query');
    const db = createDb();

    try {
      /**
       * 第一步：获取文章总数
       * 1. 使用 count() 函数计算符合条件的记录数
       * 2. 只计算未删除的文章（deletedFlag = false）
       * 3. 结果存储在 totalResult.count 中
       */
      const [totalResult] = await db.select({ count: count() }).from(posts).where(eq(posts.deletedFlag, false));

      // 计算分页信息
      const total = totalResult?.count ?? 0;
      const hasPrev = page > 1;
      const hasNext = page < Math.ceil(total / size);

      /**
       * 第二步：获取当前页的文章ID
       * 1. 只查询文章的 id 字段，减少数据传输量
       * 2. 按创建时间降序排序（desc(posts.createdAt)）
       * 3. 使用 limit 和 offset 实现分页
       *    - limit: 每页显示的数量
       *    - offset: 跳过的记录数，计算公式：(page - 1) * size
       */
      const postIds = await db
        .select({ id: posts.id })
        .from(posts)
        .where(eq(posts.deletedFlag, false))
        .orderBy(desc(posts.createdAt))
        .limit(size)
        .offset((page - 1) * size);

      // 如果没有文章，直接返回空结果
      if (postIds.length === 0) {
        return c.json({
          data: { posts: [], total, hasPrev, hasNext },
        });
      }

      /**
       * 第三步：获取文章及其标签信息
       * 1. 使用 leftJoin 连接三个表：
       *    - posts 表：文章基本信息
       *    - postsToTags 表：文章-标签关联
       *    - tags 表：标签信息
       * 2. 使用 inArray 确保只查询当前页的文章
       * 3. 返回文章的所有字段和标签的 id、name
       */
      const queryPosts = await db
        .select({
          ...getTableColumns(posts),
          tags: {
            id: tags.id,
            name: tags.name,
          },
        })
        .from(posts)
        .leftJoin(postsToTags, eq(posts.id, postsToTags.postId))
        .leftJoin(tags, eq(postsToTags.tagId, tags.id))
        .where(
          inArray(
            posts.id,
            postIds.map((p) => p.id),
          ),
        )
        .orderBy(desc(posts.createdAt));

      /**
       * 第四步：处理标签数据
       * 由于一篇文章可能有多个标签，查询结果中同一篇文章会出现多次
       * 使用 reduce 将相同文章的数据合并：
       * 1. 如果文章已存在（existingPost），将新标签添加到现有标签数组中
       * 2. 如果文章不存在，创建新文章对象并初始化标签数组
       * 最终每篇文章只出现一次，包含其所有标签
       */
      const postsWithTags = queryPosts.reduce(
        (acc, post) => {
          const existingPost = acc.find((p) => p.id === post.id);
          if (existingPost) {
            if (post.tags?.id) {
              existingPost.tags.push({
                id: post.tags.id,
                name: post.tags.name,
              });
            }
          } else {
            acc.push({
              ...post,
              tags: post.tags?.id ? [post.tags] : [],
            });
          }
          return acc;
        },
        [] as Array<typeof posts.$inferSelect & { tags: Array<{ id: string; name: string }> }>,
      );

      return c.json({
        data: { posts: postsWithTags, total, hasPrev, hasNext },
      });
    } catch (error) {
      const { error: errorMessage, status } = handleDatabaseError(error);
      return c.json({ error: errorMessage }, status as 400 | 404 | 409 | 500);
    }
  })
  .post('/', sessionMiddleware, zValidator('json', createPostSchema), async (c) => {
    const json = c.req.valid('json');
    const user = c.get('user');
    const db = createDb();

    try {
      // 创建文章
      const [post] = await db
        .insert(posts)
        .values({
          ...json,
          authorId: user.id,
        })
        .returning();

      // 如果有标签，创建标签关联
      if (json.tags && json.tags.length > 0) {
        await db.insert(postsToTags).values(
          json.tags.map((tagId) => ({
            postId: post.id,
            tagId,
          })),
        );
      }

      return c.json({ data: { slug: post.slug } });
    } catch (error) {
      const { error: errorMessage, status } = handleDatabaseError(error);
      return c.json({ error: errorMessage }, status as 400 | 404 | 409 | 500);
    }
  })
  .get('/:slug', sessionMiddleware, async (c) => {
    const { slug } = c.req.param();
    const db = createDb();

    try {
      const post = await db.query.posts.findFirst({
        with: {
          postsToTags: {
            with: {
              tag: true,
            },
          },
        },
        where: and(eq(posts.slug, slug), eq(posts.deletedFlag, false)),
      });

      if (!post) {
        return c.json({ error: 'The requested resource was not found.' }, 404);
      }

      const { postsToTags, ...rest } = post;

      return c.json({
        data: {
          ...rest,
          tags: postsToTags.map((tag) => ({ name: tag.tag.name, id: tag.tag.id })),
        },
      });
    } catch (error) {
      const { error: errorMessage, status } = handleDatabaseError(error);
      return c.json({ error: errorMessage }, status as 400 | 404 | 409 | 500);
    }
  })
  .patch('/:slug', sessionMiddleware, zValidator('json', createPostSchema), async (c) => {
    const { slug } = c.req.param();
    const json = c.req.valid('json');
    const db = createDb();

    try {
      const existingPost = await db.query.posts.findFirst({
        where: eq(posts.slug, slug),
      });

      if (!existingPost) {
        return c.json({ error: 'The requested resource was not found.' }, 404);
      }

      // 更新文章
      const [updatedPost] = await db
        .update(posts)
        .set(json)
        .where(and(eq(posts.slug, slug), eq(posts.deletedFlag, false)))
        .returning();

      // 处理标签更新
      if (json.tags) {
        // 删除旧的标签关联
        await db.delete(postsToTags).where(eq(postsToTags.postId, updatedPost.id));

        // 如果有新的标签，创建新的标签关联
        if (json.tags.length > 0) {
          await db.insert(postsToTags).values(
            json.tags.map((tagId) => ({
              postId: updatedPost.id,
              tagId,
            })),
          );
        }
      }

      return c.json({ data: { slug: updatedPost.slug } });
    } catch (error) {
      const { error: errorMessage, status } = handleDatabaseError(error);
      return c.json({ error: errorMessage }, status as 400 | 404 | 409 | 500);
    }
  })
  .delete('/:slug', sessionMiddleware, async (c) => {
    const { slug } = c.req.param();
    const db = createDb();

    try {
      await db
        .update(posts)
        .set({ status: PostStatus.DELETED, deletedFlag: true, deletedAt: new Date() })
        .where(and(eq(posts.slug, slug), eq(posts.deletedFlag, false)));

      return c.json({ data: { slug } });
    } catch (error) {
      const { error: errorMessage, status } = handleDatabaseError(error);
      return c.json({ error: errorMessage }, status as 400 | 404 | 409 | 500);
    }
  })
  .patch('/:slug/status', sessionMiddleware, zValidator('query', updatePostStatusSchema), async (c) => {
    const { slug } = c.req.param();
    const { status } = c.req.valid('query');
    const db = createDb();

    try {
      const existingPost = await db.query.posts.findFirst({
        where: eq(posts.slug, slug),
      });

      if (!existingPost) {
        return c.json({ error: 'The requested resource was not found.' }, 404);
      }

      if (existingPost.status === status) {
        return c.json({ error: 'The status is already set.' }, 400);
      }

      const [updatedPost] = await db
        .update(posts)
        .set({ status, publishedAt: status === 'published' ? new Date() : null })
        .where(and(eq(posts.slug, slug), eq(posts.deletedFlag, false)))
        .returning();

      return c.json({ data: { slug: updatedPost.slug, status: updatedPost.status } });
    } catch (error) {
      const { error: errorMessage, status } = handleDatabaseError(error);
      return c.json({ error: errorMessage }, status as 400 | 404 | 409 | 500);
    }
  });

export default app;
