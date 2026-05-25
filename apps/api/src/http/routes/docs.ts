import { Router } from 'express';
import { apiReference } from '@scalar/express-api-reference';
import { openApiDocument } from '../docs/openapi.ts';

const router = Router();

router.use(
  '/docs',
  apiReference({
    url: '/openapi.json',
  }),
);

router.get('/openapi.json', (_req, res) => {
  res.status(200).json(openApiDocument);
});

export default router;
