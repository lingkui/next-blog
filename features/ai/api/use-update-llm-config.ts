import { client } from '@/lib/rpc';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

type RequestType = InferRequestType<(typeof client.api.ai)['$patch']>;
type ResponseType = InferResponseType<(typeof client.api.ai)['$patch'], 200>;

export const useUpdateLLMConfig = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.ai.$patch({
        json,
      });

      const data = await response.json();

      if ('error' in data) {
        throw new Error(data.error);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['llm-config', 'llm-config-status'] });
      toast.success('LLM config updated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update LLM config');
    },
  });

  return mutation;
};
