import { client } from '@/lib/rpc';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface UpdateTagParams {
  param: {
    tagId: string;
  };
  json: {
    name: string;
  };
}

export const useUpdateTag = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ param, json }: UpdateTagParams) => {
      const response = await client.api.tag[':tagId'].$patch({
        param,
        json,
      });

      const data = await response.json();

      if ('error' in data) {
        throw new Error(data.error);
      }

      return data;
    },
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      queryClient.invalidateQueries({ queryKey: ['tag', data.tagId] });
      toast.success('Tag updated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update tag');
    },
  });

  return mutation;
};
