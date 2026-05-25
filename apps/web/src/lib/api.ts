import type {
  CheckoutInput,
  CheckoutResult,
} from '@casecellshop/shared/src/schemas/checkout';
import type { ApiResponseError } from '@casecellshop/shared/src/utils/responses';

export type Product = {
  id: number;
  sku: string;
  name: string;
  price: number;
  stock: number;
  imageUrl: string;
};

export type { CheckoutInput, CheckoutResult };

const API_BASE = '/api';
const CHECKOUT_TIMEOUT_MS = 10000;

export class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  const data = (await response.json().catch(() => null)) as
    | T
    | ApiResponseError
    | null;

  if (!response.ok) {
    const errorPayload = (data as ApiResponseError | null)?.error;
    throw new ApiError(
      errorPayload?.code ?? 'UNKNOWN_ERROR',
      errorPayload?.message ?? 'Algo deu errado. Tente novamente.',
      response.status,
    );
  }

  if (data === null) {
    throw new ApiError('EMPTY_RESPONSE', 'Resposta vazia da API.', response.status);
  }

  return data as T;
}

export async function fetchProducts(signal?: AbortSignal): Promise<Product[]> {
  const response = await fetch(`${API_BASE}/products`, { signal });
  return parseResponse<Product[]>(response);
}

export async function submitCheckout(
  input: CheckoutInput,
): Promise<CheckoutResult> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), CHECKOUT_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE}/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
      signal: controller.signal,
    });
    return parseResponse<CheckoutResult>(response);
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError(
        'REQUEST_TIMEOUT',
        'A criação do pedido demorou mais que o esperado. Tente novamente.',
        408,
      );
    }
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}
