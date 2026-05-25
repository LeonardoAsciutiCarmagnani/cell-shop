import { Router } from 'express';
import { ProductsController } from '../controllers/products.ts';
import { MockProductsRepository } from '../repositories/products.ts';
import { ReadAllProductsUseCase } from '../use-cases/read-all-products.ts';

const router = Router();
const productsRepository = new MockProductsRepository();
const readAllProductsUseCase = new ReadAllProductsUseCase(productsRepository);
const productsController = new ProductsController(readAllProductsUseCase);

router.get('/', productsController.readAll);

export default router;
