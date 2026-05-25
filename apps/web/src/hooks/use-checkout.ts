import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitCheckout } from '@/lib/api';
import { productsQueryKey } from './use-products';

export function useCheckoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitCheckout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productsQueryKey });
    },
  });
}
