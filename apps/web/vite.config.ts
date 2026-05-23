import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

const rootDir = resolve(fileURLToPath(new URL('.', import.meta.url)), '../..');

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, rootDir, '');

  return {
    plugins: [react()],
    envDir: rootDir,
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
