import type { CheckoutInput, CheckoutResult } from '@casecellshop/shared/src/schemas/checkout.ts';

export interface CheckoutRepository {
  create(order: CheckoutInput): Promise<CheckoutResult>;
}

export class MockCheckoutRepository implements CheckoutRepository {
  public async create(_order: CheckoutInput): Promise<CheckoutResult> {
    const orderId = crypto.randomUUID();

    return {
      orderId,
      status: 'SUCCESS',
    };
  }
}
