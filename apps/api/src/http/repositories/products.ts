import { mockProducts } from '../../mocks/products.js';
import type { Product } from '../../schemas/product.js';

export interface ProductsRepository {
  readAll(): Promise<Product[]>;
}

export class MockProductsRepository implements ProductsRepository {
  public async readAll() {
    return mockProducts;
  }
}
