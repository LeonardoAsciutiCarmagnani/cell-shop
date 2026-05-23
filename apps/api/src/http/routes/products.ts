import { Router } from 'express';
import { ProductsController } from '../controllers/products.js';
import { MockProductsRepository } from '../repositories/products.js';
import { ReadAllProductsUseCase } from '../use-cases/read-all-products.js';

const router = Router();
const productsRepository = new MockProductsRepository();
const readAllProductsUseCase = new ReadAllProductsUseCase(productsRepository);
const productsController = new ProductsController(readAllProductsUseCase);

router.get('/', productsController.readAll);

export default router;
