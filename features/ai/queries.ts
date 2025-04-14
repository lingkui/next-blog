import { createKV } from '@/lib/kv';

export const runtime = 'edge';

export const getLLMConfig = async () => {
  const KV = createKV();

  const model = await KV.get('llm-model');
  const endpoint = await KV.get('llm-endpoint');
  const apiKey = await KV.get('llm-api-key');

  return { model, endpoint, apiKey };
};
