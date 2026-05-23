import { Router } from 'express';
import productsRouter from './products.js';

const router = Router();

router.use('/products', productsRouter);
// router.use('/checkout', checkoutRouter);
// router.use('/order', orderRouter);
// router.use('/health', healthRouter);

export default router;
