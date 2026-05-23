import { z } from 'zod';

export const productSchema = z.object({
  sku: z.string(),
  name: z.string(),
  price: z.number(),
  stock: z.number(),
});

export type Product = z.infer<typeof productSchema>;
