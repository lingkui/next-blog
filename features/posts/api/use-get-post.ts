import { client } from '@/lib/rpc';
import { useQuery } from '@tanstack/react-query';

interface UseGetPostProps {
  slug: string;
}

export const useGetPost = ({ slug }: UseGetPostProps) => {
  const query = useQuery({
    queryKey: ['post', slug],
    queryFn: async () => {
      const response = await client.api.post[':slug'].$get({
        param: { slug },
      });

      const data = await response.json();

      if ('error' in data) {
        throw new Error(data.error);
      }

      return data.data;
    },
  });

  return query;
};
