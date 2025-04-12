import { eq } from 'drizzle-orm';
import { createDb } from '../../lib/db';
import { users } from '../../lib/db/schema';

export const runtime = 'edge';

export async function hasAtLeastOneUser() {
  const db = createDb();
  const user = await db.query.users.findFirst();

  return !!user;
}

export async function getUserFromDb(username: string) {
  const db = createDb();
  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
  });

  return user;
}
