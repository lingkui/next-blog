import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }).trim(),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }).trim(),
});

export const createUserSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }).trim(),
  lastName: z.string().min(1, { message: 'Last name is required' }).trim(),
  username: z.string().min(1, { message: 'Username is required' }).trim(),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }).trim(),
});
