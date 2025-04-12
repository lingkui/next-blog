import { verifyPassword } from '@/lib/password';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { drizzle } from 'drizzle-orm/d1';
import NextAuth, { User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { getUserFromDb } from '../features/users/queries';
import { accounts, users } from './db/schema';

export const { handlers, signIn, signOut, auth } = NextAuth(() => {
  const db = drizzle(getRequestContext().env.DB);

  return {
    secret: process.env.AUTH_SECRET,
    adapter: DrizzleAdapter(db, {
      usersTable: users,
      accountsTable: accounts,
    }),
    providers: [
      Credentials({
        credentials: {
          username: { label: 'Username', type: 'text' },
          password: { label: 'Password', type: 'password' },
        },
        authorize: async (credentials) => {
          const user = await getUserFromDb(credentials.username as string);

          if (!user) {
            throw new Error('Invalid credentials.');
          }

          const verified = verifyPassword(credentials.password as string, user.password as string);

          if (!verified) {
            throw new Error('Invalid credentials.');
          }

          return { ...user, password: undefined };
        },
      }),
    ],
    callbacks: {
      session({ session, token }) {
        if (token.sub) {
          session.user.id = token.sub;
        }
        return session;
      },
    },
    session: {
      strategy: 'jwt',
    },
  };
});

export type CurrentUser = Omit<User, 'id' | 'name'> & { id: string; name: string };

export async function getCurrentUser() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  return session.user as CurrentUser;
}
