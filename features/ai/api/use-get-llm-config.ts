import { client } from '@/lib/rpc';
import { useQuery } from '@tanstack/react-query';

export const useGetLLMConfig = () => {
  const query = useQuery({
    queryKey: ['llm-config'],
    queryFn: async () => {
      const response = await client.api.ai.$get();
      const { data } = await response.json();


      return {
        model: data?.model ?? '',
        endpoint: data?.endpoint ?? '',
        apiKey: data?.apiKey ?? '',
      };
    },
  });

  return query;
};
