import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/lib/api';

export const productsQueryKey = ['products'] as const;

export function useProducts() {
  return useQuery({
    queryKey: productsQueryKey,
    queryFn: ({ signal }) => fetchProducts(signal),
    staleTime: Infinity,
  });
}
