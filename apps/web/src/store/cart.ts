import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import type { Product } from '@/lib/api';

export type CartItem = {
  sku: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
};

type CartState = {
  items: Record<string, CartItem>;
  setQuantity: (product: Product, quantity: number) => void;
  increment: (product: Product) => void;
  decrement: (product: Product) => void;
  remove: (sku: string) => void;
  clear: () => void;
};

const clampQuantity = (value: number) => {
  if (!Number.isFinite(value) || value <= 0) return 0;
  const safe = Math.floor(value);
  return safe;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: {},
      setQuantity: (product, quantity) =>
        set((state) => {
          const next = clampQuantity(quantity);
          const items = { ...state.items };

          if (next === 0) {
            delete items[product.sku];
            return { items };
          }

          items[product.sku] = {
            sku: product.sku,
            name: product.name,
            price: product.price,
            stock: product.stock,
            quantity: next,
          };
          return { items };
        }),
      increment: (product) =>
        set((state) => {
          const current = state.items[product.sku]?.quantity ?? 0;
          const next = clampQuantity(current + 1);
          if (next === current) return state;

          return {
            items: {
              ...state.items,
              [product.sku]: {
                sku: product.sku,
                name: product.name,
                price: product.price,
                stock: product.stock,
                quantity: next,
              },
            },
          };
        }),
      decrement: (product) =>
        set((state) => {
          const current = state.items[product.sku]?.quantity ?? 0;
          const next = current - 1;
          const items = { ...state.items };

          if (next <= 0) {
            delete items[product.sku];
            return { items };
          }

          items[product.sku] = {
            sku: product.sku,
            name: product.name,
            price: product.price,
            stock: product.stock,
            quantity: next,
          };
          return { items };
        }),
      remove: (sku) =>
        set((state) => {
          const items = { ...state.items };
          delete items[sku];
          return { items };
        }),
      clear: () => set({ items: {} }),
    }),
    {
      name: 'cellshop:cart',
      version: 1,
    },
  ),
);

export const useCartItems = () =>
  useCartStore(useShallow((state) => Object.values(state.items)));

export const useCartCount = () =>
  useCartStore((state) =>
    Object.values(state.items).reduce((sum, item) => sum + item.quantity, 0),
  );

export const useCartTotal = () =>
  useCartStore((state) =>
    Object.values(state.items).reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    ),
  );

export const useItemQuantity = (sku: string) =>
  useCartStore((state) => state.items[sku]?.quantity ?? 0);
