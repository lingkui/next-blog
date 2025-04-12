import { client } from '@/lib/rpc';
import { useQuery } from '@tanstack/react-query';

interface UseGetPostsProps {
  page: number;
  size?: number;
}

export const useGetPosts = ({ page, size }: UseGetPostsProps) => {
  const query = useQuery({
    queryKey: ['posts', page, size],
    queryFn: async () => {
      const response = await client.api.post.$get({
        query: {
          page: page.toString(),
          size: size?.toString(),
        },
      });

      const data = await response.json();

      if ('error' in data) {
        throw new Error(data.error);
      }

      return data.data;
    },
    placeholderData: (previousData) => previousData,
  });

  return query;
};
