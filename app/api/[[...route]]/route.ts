import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import user from '@/features/users/server/route';
import post from '@/features/posts/server/route';
import tag from '@/features/tags/server/route';

const app = new Hono().basePath('/api');

export const runtime = 'edge';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app.route('/user', user).route('/post', post).route('/tag', tag);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
