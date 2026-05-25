import { mockProducts } from '../../mocks/products.ts';
import type { Product } from '../../schemas/product.ts';

export interface ProductsRepository {
  readAll(): Promise<Product[]>;
  findBySku(sku: string): Promise<Product | null>;
  decrementStock(sku: string, quantity: number): Promise<void>;
}

export class MockProductsRepository implements ProductsRepository {
  public async readAll() {
    return mockProducts.map((product) => ({ ...product }));
  }

  public async findBySku(sku: string) {
    const found = mockProducts.find((product) => product.sku === sku);
    return found ?? null;
  }

  public async decrementStock(sku: string, quantity: number) {
    const product = mockProducts.find((item) => item.sku === sku);

    if (!product) {
      return;
    }

    product.stock -= quantity;
  }
}
