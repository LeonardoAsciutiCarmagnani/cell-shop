import type { Product } from '../../schemas/product.ts';
import type { ProductsRepository } from '../repositories/products.ts';

export interface ReadAllProductsUseCaseContract {
  execute(): Promise<Product[]>;
}

export class ReadAllProductsUseCase implements ReadAllProductsUseCaseContract {
  constructor(private readonly productsRepository: ProductsRepository) {}

  public async execute() {
    try {
      const products = await this.productsRepository.readAll();
      return products;
    } catch (error) {
      console.error('[READ_ALL_PRODUCTS] - Erro:', error);
      throw new Error('CATALOG_UNAVAILABLE');
    }
  }
}
