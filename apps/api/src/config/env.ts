import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..');

config({ path: resolve(root, '.env') });

function required(name: string): string {
  const value = process.env[name];

  if (!value) {
    console.error(`Variável de ambiente obrigatória ausente: ${name}`);
    process.exit(1);
  }

  return value;
}

export const env = {
  nodeEnv: required('NODE_ENV'),
  port: Number(required('API_PORT')),
};
