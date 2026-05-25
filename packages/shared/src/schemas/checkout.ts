import { z } from 'zod';

export const checkoutItemSchema = z.object({
  sku: z.string().trim().min(1, 'O SKU é obrigatório'),
  quantity: z.number().int().min(1, 'A quantidade mínima é 1'),
});

export const checkoutSchema = z.object({
  items: z.array(checkoutItemSchema).min(1, 'O pedido deve conter ao menos um item'),
});

export type CheckoutItemInput = z.infer<typeof checkoutItemSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;

export type CheckoutResult = {
  orderId: string;
  status: 'SUCCESS';
};
