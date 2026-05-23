import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import router from './http/routes/router.js';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(router);

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  return app;
}

export function startServer() {
  const app = createApp();

  app.listen(env.port, env.host, () => {
    console.log(`API rodando em http://localhost:${env.port}`);
  });
}
