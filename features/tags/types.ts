import { client } from '@/lib/rpc';
import { InferResponseType } from 'hono';

type GetTagsResponseType = InferResponseType<(typeof client.api.tag)[':tagName']['$get'], 200>;

export type Tag = GetTagsResponseType['data'];
