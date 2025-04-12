import { client } from '@/lib/rpc';
import { useQuery } from '@tanstack/react-query';

export const useGetTags = () => {
  const query = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const response = await client.api.tag.$get();
      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
