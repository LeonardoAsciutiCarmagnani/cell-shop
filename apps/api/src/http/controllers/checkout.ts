import type { Request, Response } from 'express';
import { ApiResponse } from '@casecellshop/shared/src/utils/responses.ts';
import { CheckoutDomainError } from '../use-cases/checkout.ts';
import type { CheckoutUseCaseContract } from '../use-cases/checkout.ts';
import { checkoutSchema } from '@casecellshop/shared/src/schemas/checkout.ts';

export class CheckoutController {
  constructor(private readonly checkoutUseCase: CheckoutUseCaseContract) {}

  public create = async (req: Request, res: Response) => {
    try {
      const orderBody = checkoutSchema.safeParse(req.body);

      if (!orderBody.success) {
        const firstError = orderBody.error.issues[0]?.message ?? 'Payload inválido.';
        return res.status(400).json(ApiResponse.badRequest(firstError));
      }

      const order = await this.checkoutUseCase.execute(orderBody.data);

      return res.status(201).json(ApiResponse.created(order));
    } catch (error) {
      if (error instanceof CheckoutDomainError) {
        if (error.code === 'OUT_OF_STOCK') {
          return res.status(422).json(ApiResponse.unprocessable('OUT_OF_STOCK', error.message));
        }

        return res.status(400).json(ApiResponse.badRequest(error.message));
      }

      return res
        .status(503)
        .json(
          ApiResponse.serviceUnavailable(
            'CHECKOUT_UNAVAILABLE',
            'Não foi possível processar seu pedido agora. Tente novamente mais tarde.',
          ),
        );
    }
  };
}
