import { client } from '@/lib/rpc';
import { InferResponseType } from 'hono';

type GetPostResponseType = InferResponseType<(typeof client.api.post)[':slug']['$get'], 200>;

export type Post = GetPostResponseType['data'];

export type PublishedPost = Pick<Post, 'title' | 'slug' | 'cover' | 'excerpt'> & {
  tags: string[];
  publishedAt: Date | null;
};

export const PostStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  DELETED: 'deleted',
} as const;

export interface Heading {
  text: string;
  level: number;
  children: Heading[];
}
