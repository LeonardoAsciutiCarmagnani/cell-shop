import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..');

config({ path: resolve(root, '.env') });

function required(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Variável de ambiente obrigatória ausente: ${name}`);
  }

  return value;
}

function optional(name: string, fallback: string): string {
  return process.env[name] ?? fallback;
}

export const env = {
  nodeEnv: optional('NODE_ENV', 'development'),
  port: Number(optional('API_PORT', '3000')),
  host: optional('API_HOST', '0.0.0.0'),
  databaseUrl: required('DATABASE_URL'),
  redisUrl: required('REDIS_URL'),
  cacheTtlSeconds: Number(optional('CACHE_TTL_SECONDS', '300')),
  idempotencyTtlSeconds: Number(optional('IDEMPOTENCY_TTL_SECONDS', '86400')),
};
