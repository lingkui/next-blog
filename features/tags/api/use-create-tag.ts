import { client } from '@/lib/rpc';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

type RequestType = InferRequestType<(typeof client.api.tag)['$post']>;
type ResponseType = InferResponseType<(typeof client.api.tag)['$post'], 200>;

export const useCreateTag = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.tag.$post({
        json,
      });

      const data = await response.json();

      if ('error' in data) {
        throw new Error(data.error);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      toast.success('Tag created successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create tag');
    },
  });

  return mutation;
};
