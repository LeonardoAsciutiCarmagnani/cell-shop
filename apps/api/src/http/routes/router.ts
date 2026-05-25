import { Request, Response, Router } from 'express';
import checkoutRouter from './checkout.ts';
import docsRouter from './docs.ts';
import productsRouter from './products.ts';

const router = Router();

router.use('/health', (req: Request, res: Response) => res.status(200).json({ status: 'ok' }));
router.use('/products', productsRouter);
router.use('/checkout', checkoutRouter);
router.use(docsRouter);

export default router;
