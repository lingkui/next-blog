import { client } from '@/lib/rpc';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

type RequestType = InferRequestType<(typeof client.api.post)[':slug']['$delete']>;
type ResponseType = InferResponseType<(typeof client.api.post)[':slug']['$delete'], 200>;

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.post[':slug'].$delete({
        param,
      });

      const data = await response.json();

      if ('error' in data) {
        throw new Error(data.error);
      }

      return data;
    },
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', data.slug] });
      toast.success('Post updated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update post');
    },
  });

  return mutation;
};
