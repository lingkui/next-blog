import { createDb } from '@/lib/db';
import { tags } from '@/lib/db/schema';
import { sessionMiddleware } from '@/lib/session-middleware';
import { zValidator } from '@hono/zod-validator';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { createTagSchema } from '../schemas';
import { createErrorHandler } from '@/lib/error-handler';

// 创建带有自定义消息的错误处理器
const { handleDatabaseError } = createErrorHandler({
  uniqueConstraint: (field) => {
    switch (field) {
      case 'name':
        return 'This name is already in use. Please choose a different one.';
      default:
        return 'This value already exists. Please try a different one.';
    }
  },
});

const app = new Hono()
  .get('/', async (c) => {
    const db = createDb();
    const existingTags = await db.select().from(tags);

    return c.json({ data: existingTags });
  })
  .post('/', sessionMiddleware, zValidator('json', createTagSchema), async (c) => {
    const db = createDb();
    const { name } = c.req.valid('json');

    try {
      const tag = await db.insert(tags).values({ name }).returning();

      return c.json({ data: tag[0] });
    } catch (error) {
      const { error: errorMessage, status } = handleDatabaseError(error);
      return c.json({ error: errorMessage }, status as 400 | 404 | 409 | 500);
    }
  })
  .get('/:tagName', async (c) => {
    const db = createDb();
    const { tagName } = c.req.param();

    try {
      const existingTag = await db.query.tags.findFirst({
        where: eq(tags.name, tagName),
      });

      if (!existingTag) {
        return c.json({ error: 'Tag not found' }, 404);
      }

      return c.json({ data: existingTag });
    } catch (error) {
      const { error: errorMessage, status } = handleDatabaseError(error);
      return c.json({ error: errorMessage }, status as 400 | 404 | 409 | 500);
    }
  })
  .patch('/:tagId', sessionMiddleware, zValidator('json', createTagSchema), async (c) => {
    const db = createDb();
    const { tagId } = c.req.param();
    const { name } = c.req.valid('json');

    try {
      const existingTag = await db.query.tags.findFirst({
        where: eq(tags.id, tagId),
      });

      if (!existingTag) {
        return c.json({ error: 'Tag not found' }, 404);
      }

      await db.update(tags).set({ name }).where(eq(tags.id, tagId));

      return c.json({ data: { tagId } });
    } catch (error) {
      const { error: errorMessage, status } = handleDatabaseError(error);
      return c.json({ error: errorMessage }, status as 400 | 404 | 409 | 500);
    }
  })
  .delete('/:tagId', sessionMiddleware, async (c) => {
    const db = createDb();
    const { tagId } = c.req.param();

    try {
      const existingTag = await db.query.tags.findFirst({
        where: eq(tags.id, tagId),
      });

      if (!existingTag) {
        return c.json({ error: 'Tag not found' }, 404);
      }
      await db.delete(tags).where(eq(tags.id, tagId));

      return c.json({ data: { tagId } });
    } catch (error) {
      const { error: errorMessage, status } = handleDatabaseError(error);
      return c.json({ error: errorMessage }, status as 400 | 404 | 409 | 500);
    }
  });

export default app;
