import { z } from 'zod';

export const productSchema = z.object({
  id: z.number(),
  sku: z.string(),
  name: z.string(),
  price: z.number(),
  stock: z.number(),
  imageUrl: z.string(),
});

export type Product = z.infer<typeof productSchema>;
