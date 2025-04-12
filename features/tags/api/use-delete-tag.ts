import { client } from '@/lib/rpc';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface DeleteTagParams {
  param: {
    tagId: string;
  };
}

export const useDeleteTag = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ param }: DeleteTagParams) => {
      const response = await client.api.tag[':tagId'].$delete({
        param,
      });

      const data = await response.json();

      if ('error' in data) {
        throw new Error(data.error);
      }

      return data;
    },
    onSuccess: () => {
      toast.success('Tag deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete tag');
    },
  });

  return mutation;
};
