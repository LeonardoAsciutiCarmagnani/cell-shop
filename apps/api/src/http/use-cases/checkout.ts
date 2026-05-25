import type {
  CheckoutInput,
  CheckoutItemInput,
  CheckoutResult,
} from '@casecellshop/shared/src/schemas/checkout.ts';
import type { CheckoutRepository } from '../repositories/checkout.ts';
import type { ProductsRepository } from '../repositories/products.ts';

export class CheckoutDomainError extends Error {
  constructor(
    public readonly code: 'PRODUCT_NOT_FOUND' | 'OUT_OF_STOCK',
    message: string,
  ) {
    super(message);
    this.name = 'CheckoutDomainError';
  }
}

export class ProductNotFoundError extends CheckoutDomainError {
  constructor(sku: string) {
    super('PRODUCT_NOT_FOUND', `Produto não encontrado para o SKU: ${sku}.`);
    this.name = 'ProductNotFoundError';
  }
}

export class OutOfStockError extends CheckoutDomainError {
  constructor(sku: string) {
    super('OUT_OF_STOCK', `Estoque insuficiente para o SKU: ${sku}.`);
    this.name = 'OutOfStockError';
  }
}

export interface CheckoutUseCaseContract {
  execute(order: CheckoutInput): Promise<CheckoutResult>;
}

export class CheckoutUseCase implements CheckoutUseCaseContract {
  constructor(
    private readonly checkoutRepository: CheckoutRepository,
    private readonly productsRepository: ProductsRepository,
  ) {}

  private async validateStockOrThrow(items: CheckoutItemInput[]) {
    for (const item of items) {
      const product = await this.productsRepository.findBySku(item.sku);

      if (!product) {
        throw new ProductNotFoundError(item.sku);
      }

      if (item.quantity > product.stock) {
        throw new OutOfStockError(item.sku);
      }
    }
  }

  public async execute(order: CheckoutInput): Promise<CheckoutResult> {
    try {
      await this.validateStockOrThrow(order.items);

      for (const item of order.items) {
        await this.productsRepository.decrementStock(item.sku, item.quantity);
      }

      const orderCreated = await this.checkoutRepository.create(order);
      return orderCreated;
    } catch (error) {
      if (error instanceof CheckoutDomainError) {
        throw error;
      }

      console.error('[CHECKOUT] - Erro:', error);
      throw new Error('CHECKOUT_UNAVAILABLE');
    }
  }
}
