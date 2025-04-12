import { createDb } from '@/lib/db';

export const runtime = 'edge';

export const getTags = async () => {
  const db = createDb();
  const tags = await db.query.tags.findMany({
    orderBy: (tags, { desc }) => [desc(tags.createdAt)],
  });

  return tags;
};
