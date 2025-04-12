import { z } from 'zod';
import { PostStatus } from './types';

export const getPostsSchema = z.object({
  page: z
    .string()
    .default('1')
    .transform((val) => parseInt(val)),
  size: z
    .string()
    .default('10')
    .transform((val) => parseInt(val)),
});

export const createPostSchema = z.object({
  slug: z.string().min(1, { message: 'Slug is required' }),
  title: z.string().min(1, { message: 'Title is required' }),
  cover: z.union([z.string(), z.null()]),
  content: z.string().min(1, { message: 'Content is required' }),
  excerpt: z.union([z.string(), z.null()]),
  status: z.enum([PostStatus.DRAFT, PostStatus.PUBLISHED, PostStatus.DELETED], { message: 'Status is required' }),
  tags: z.array(z.string()).optional(),
});

export const updatePostStatusSchema = z.object({
  status: z.enum([PostStatus.DRAFT, PostStatus.PUBLISHED, PostStatus.DELETED], { message: 'Status is required' }),
});
