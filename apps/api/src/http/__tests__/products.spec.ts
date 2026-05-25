import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import { createApp } from '../../server.ts';

let server: Server | undefined;

function getBaseUrl() {
  const app = createApp();
  server = app.listen(0);
  const address = server.address() as AddressInfo;
  return `http://127.0.0.1:${address.port}`;
}

afterEach(async () => {
  await new Promise<void>((resolve, reject) => {
    if (!server) {
      resolve();
      return;
    }

    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
  server = undefined;
});

test('GET /products deve retornar produtos mock com status 200', async () => {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/products`);
  const body = (await response.json()) as Array<Record<string, unknown>>;

  assert.equal(response.status, 200);
  assert.ok(Array.isArray(body));
  assert.ok(body.length > 0);
  assert.equal(typeof body[0]?.sku, 'string');
  assert.equal(typeof body[0]?.stock, 'number');
});
