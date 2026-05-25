import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv } from 'vite';

const currentDir = resolve(fileURLToPath(new URL('.', import.meta.url)));
const rootDir = resolve(currentDir, '../..');

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, rootDir, '');

  return {
    plugins: [react(), tailwindcss()],
    envDir: rootDir,
    resolve: {
      alias: {
        '@': resolve(currentDir, 'src'),
      },
    },
    server: {
      port: Number(env.WEB_PORT) || 5173,
      proxy: {
        '/api': {
          target: `http://localhost:${env.API_PORT || 3000}`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  };
});
