import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { createApp } from '../../server.ts';

type ProductDto = {
  sku: string;
  stock: number;
};

let server: Server | undefined;

function getBaseUrl() {
  const app = createApp();
  server = app.listen(0);
  const address = server.address() as AddressInfo;
  return `http://127.0.0.1:${address.port}`;
}

async function readProducts(baseUrl: string) {
  const productsResponse = await fetch(`${baseUrl}/products`);
  assert.equal(productsResponse.status, 200);
  return (await productsResponse.json()) as ProductDto[];
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

test('POST /checkout deve finalizar com 201 e reduzir estoque', async () => {
  const baseUrl = getBaseUrl();
  const initialProducts = await readProducts(baseUrl);
  const selectedProduct = initialProducts.find((product) => product.stock > 0);

  assert.ok(selectedProduct);

  const checkoutResponse = await fetch(`${baseUrl}/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [{ sku: selectedProduct.sku, quantity: 1 }],
    }),
  });

  const checkoutBody = (await checkoutResponse.json()) as Record<string, unknown>;
  assert.equal(checkoutResponse.status, 201);
  assert.equal(checkoutBody.status, 'SUCCESS');
  assert.equal(typeof checkoutBody.orderId, 'string');

  const productsAfterCheckout = await readProducts(baseUrl);
  const updatedProduct = productsAfterCheckout.find(
    (product) => product.sku === selectedProduct.sku,
  );

  assert.ok(updatedProduct);
  assert.equal(updatedProduct.stock, selectedProduct.stock - 1);
});

test('POST /checkout deve retornar 400 para body inválido', async () => {
  const baseUrl = getBaseUrl();
  const checkoutResponse = await fetch(`${baseUrl}/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: [] }),
  });

  const checkoutBody = (await checkoutResponse.json()) as { error: { code: string } };
  assert.equal(checkoutResponse.status, 400);
  assert.equal(checkoutBody.error.code, 'VALIDATION_ERROR');
});

test('POST /checkout deve retornar 422 para estoque insuficiente', async () => {
  const baseUrl = getBaseUrl();
  const products = await readProducts(baseUrl);
  const selectedProduct = products[0];

  assert.ok(selectedProduct);

  const checkoutResponse = await fetch(`${baseUrl}/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [{ sku: selectedProduct.sku, quantity: selectedProduct.stock + 9999999999 }],
    }),
  });

  const checkoutBody = (await checkoutResponse.json()) as { error: { code: string } };
  assert.equal(checkoutResponse.status, 422);
  assert.equal(checkoutBody.error.code, 'OUT_OF_STOCK');
});

test('POST /checkout não deve reduzir estoque quando algum item não tem estoque suficiente', async () => {
  const baseUrl = getBaseUrl();
  const products = await readProducts(baseUrl);
  const availableProducts = products.filter((product) => product.stock > 0);
  const validProduct = availableProducts[0];
  const unavailableProduct = availableProducts[1];

  assert.ok(validProduct);
  assert.ok(unavailableProduct);

  const checkoutResponse = await fetch(`${baseUrl}/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [
        { sku: validProduct.sku, quantity: 1 },
        { sku: unavailableProduct.sku, quantity: unavailableProduct.stock + 1 },
      ],
    }),
  });

  const checkoutBody = (await checkoutResponse.json()) as { error: { code: string } };
  assert.equal(checkoutResponse.status, 422);
  assert.equal(checkoutBody.error.code, 'OUT_OF_STOCK');

  const productsAfterCheckout = await readProducts(baseUrl);
  const validProductAfterCheckout = productsAfterCheckout.find(
    (product) => product.sku === validProduct.sku,
  );
  const unavailableProductAfterCheckout = productsAfterCheckout.find(
    (product) => product.sku === unavailableProduct.sku,
  );

  assert.ok(validProductAfterCheckout);
  assert.ok(unavailableProductAfterCheckout);
  assert.equal(validProductAfterCheckout.stock, validProduct.stock);
  assert.equal(unavailableProductAfterCheckout.stock, unavailableProduct.stock);
});
