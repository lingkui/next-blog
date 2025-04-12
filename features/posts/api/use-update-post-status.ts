import { client } from '@/lib/rpc';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

type RequestType = InferRequestType<(typeof client.api.post)[':slug']['status']['$patch']>;
type ResponseType = InferResponseType<(typeof client.api.post)[':slug']['status']['$patch'], 200>;

export const useUpdatePostStatus = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, query }) => {
      const response = await client.api.post[':slug'].status['$patch']({
        query,
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
      toast.success(`Post now ${data.status}`);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update post status');
    },
  });

  return mutation;
};
