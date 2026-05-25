import { copyFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const envFile = join(root, '.env');
const envExample = join(root, '.env.example');

if (!existsSync(envExample)) {
  console.error('Arquivo .env.example não encontrado.');
  process.exit(1);
}

if (existsSync(envFile)) {
  process.exit(0);
}

copyFileSync(envExample, envFile);
console.log('.env criado a partir de .env.example');
