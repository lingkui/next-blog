import { createKV } from '@/lib/kv';

export const runtime = 'edge';

export const updateLLMConfig = async (model: string, endpoint: string, apiKey: string) => {
  const KV = createKV();

  await KV.put('llm-model', model);
  await KV.put('llm-endpoint', endpoint);
  await KV.put('llm-api-key', apiKey);
};
