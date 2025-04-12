import { createMiddleware } from 'hono/factory';
import { CurrentUser, getCurrentUser } from './auth';

type AdditionalContext = {
  Variables: {
    user: CurrentUser;
  };
};

export const sessionMiddleware = createMiddleware<AdditionalContext>(async (c, next) => {
  const user = await getCurrentUser();
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  c.set('user', user);

  return await next();
});
