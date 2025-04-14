import { client } from '@/lib/rpc';
import { useQuery } from '@tanstack/react-query';

export const useGetLLMConfigStatus = () => {
  return useQuery({
    queryKey: ['llm-config-status'],
    queryFn: async () => {
      const response = await client.api.ai.status.$get();

      const { data } = await response.json();

      return data.isReady;
    },
  });
};
