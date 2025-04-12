import { client } from '@/lib/rpc';
import { useMutation } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';

type RequestType = InferRequestType<(typeof client.api.user)['$post']>['json'];
type ResponseType = InferResponseType<(typeof client.api.user)['$post']>;

export const useCreateUser = () => {
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.user.$post({
        json,
      });

      const data = await response.json();

      if ('error' in data) {
        throw new Error(data.error);
      }

      return data;
    },
  });
};
