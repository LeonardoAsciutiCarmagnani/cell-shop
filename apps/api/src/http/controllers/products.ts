import type { Request, Response } from 'express';
import { ApiResponse } from '@casecellshop/shared/src/utils/responses.ts';
import type { ReadAllProductsUseCaseContract } from '../use-cases/read-all-products.ts';

export class ProductsController {
  constructor(private readonly readAllProductsUseCase: ReadAllProductsUseCaseContract) {}

  public readAll = async (_req: Request, res: Response) => {
    try {
      const products = await this.readAllProductsUseCase.execute();

      return res.status(200).json(ApiResponse.ok(products));
    } catch {
      return res
        .status(503)
        .json(
          ApiResponse.serviceUnavailable(
            'CATALOG_UNAVAILABLE',
            'Não foi possível carregar os produtos da vitrine. Por favor, tente novamente mais tarde.',
          ),
        );
    }
  };
}
