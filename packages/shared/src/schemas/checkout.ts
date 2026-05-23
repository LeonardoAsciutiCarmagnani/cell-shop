import { z } from 'zod';

export const checkoutSchema = z.object({
  customerId: z.string('ID do cliente inválido'),
  sku: z.string().min(1, 'O SKU é obrigatório'),
  quantity: z.number().int().min(1, 'A quantidade mínima é 1'),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
