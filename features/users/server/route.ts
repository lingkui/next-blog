import { createDb } from '@/lib/db';
import { createUserSchema } from '@/features/users/schemas';
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { posts, users } from '@/lib/db/schema';
import { saltAndHashPassword } from '@/lib/password';

export const runtime = 'edge';

const app = new Hono().post('/', zValidator('json', createUserSchema), async (c) => {
  const { firstName, lastName, username, password } = c.req.valid('json');
  const db = createDb();

  try {
    const user = await db
      .insert(users)
      .values({
        name: `${firstName} ${lastName}`,
        username,
        password: saltAndHashPassword(password),
      })
      .returning();

    await db.insert(posts).values({
      title: 'About',
      content: '# About me',
      slug: 'about',
      authorId: user[0].id,
      status: 'published',
      publishedAt: new Date(),
    });

    return c.json({ success: true });
  } catch (error) {
    console.log('Failed to create user:', error);
    return c.json({ error: 'Username already exists' }, 400);
  }
});

export default app;
