import cors from 'cors';
import express from 'express';
import { env } from './config/env.ts';
import { Logger } from './http/middlewares/logger.ts';
import router from './http/routes/router.ts';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(Logger);
  app.use(router);

  return app;
}

export function startServer() {
  const app = createApp();

  app.listen(env.port, () => {
    console.log(`API rodando em http://localhost:${env.port}`);
  });
}
