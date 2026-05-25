import { Router } from 'express';
import { CheckoutController } from '../controllers/checkout.ts';
import { MockCheckoutRepository } from '../repositories/checkout.ts';
import { MockProductsRepository } from '../repositories/products.ts';
import { CheckoutUseCase } from '../use-cases/checkout.ts';

const router = Router();
const checkoutRepository = new MockCheckoutRepository();
const productsRepository = new MockProductsRepository();
const checkoutUseCase = new CheckoutUseCase(checkoutRepository, productsRepository);
const checkoutController = new CheckoutController(checkoutUseCase);

router.post('/', checkoutController.create);

export default router;
