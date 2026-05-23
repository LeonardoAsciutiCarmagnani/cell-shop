import type { Request, Response } from 'express';
import type { ReadAllProductsUseCaseContract } from '../use-cases/read-all-products.js';

export class ProductsController {
  constructor(private readonly readAllProductsUseCase: ReadAllProductsUseCaseContract) {}

  public readAll = async (req: Request, res: Response) => {
    try {
      console.log('[GET] /PRODUCTS - Bucando produtos da vitrine...', req.body);

      const products = await this.readAllProductsUseCase.execute();

      console.log(`[GET] /PRODUCTS - Produtos encontrados: ${products.length}`);
      return res.status(200).json(products);
    } catch (error) {
      console.error('[GET] /PRODUCTS - Erro:', error);
      return res.status(503).json({
        error: {
          code: 'CATALOG_UNAVAILABLE',
          message: 'Não foi possível carregar os produtos. Por favor, tente novamente mais tarde.',
        },
      });
    }
  };
}
