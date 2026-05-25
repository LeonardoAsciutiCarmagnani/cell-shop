import { useEffect, useId, useState } from 'react';
import { ImageOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { QuantityStepper } from './quantity-stepper';
import { useCartStore, useItemQuantity } from '@/store/cart';
import type { Product } from '@/lib/api';
import { cn, formatCurrency } from '@/lib/utils';

const TEST_QUANTITY_LIMIT = 999;

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const quantity = useItemQuantity(product.sku);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const [hasImageError, setHasImageError] = useState(false);

  const outOfStock = product.stock <= 0;
  const lowStock = !outOfStock && product.stock <= 3;
  const stepperId = useId();
  const showImage = Boolean(product.imageUrl) && !hasImageError;

  useEffect(() => {
    setHasImageError(false);
  }, [product.imageUrl]);

  return (
    <Card
      className={cn(
        'group relative flex h-full flex-col overflow-hidden transition-all',
        outOfStock ? 'opacity-95 grayscale' : 'hover:-translate-y-0.5 hover:shadow-md',
      )}
    >
      <div className="relative flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-muted to-accent/40">
        {showImage ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="size-full object-cover"
            loading="lazy"
            onError={() => setHasImageError(true)}
          />
        ) : (
          <ImageOff className="size-12 text-muted-foreground/50" aria-hidden />
        )}
        <div className="absolute right-2 top-2 flex flex-col items-end gap-1">
          {outOfStock ? (
            <Badge variant="destructive" className="shadow-sm">
              Indisponível
            </Badge>
          ) : lowStock ? (
            <Badge variant="secondary" className="shadow-sm">
              Últimas unidades
            </Badge>
          ) : null}
        </div>
      </div>

      <CardContent className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {product.sku}
        </p>
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug">{product.name}</h3>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <span className="text-xl font-bold tracking-tight">{formatCurrency(product.price)}</span>
          {!outOfStock && (
            <span className="text-xs text-muted-foreground">{product.stock} em estoque</span>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-3 border-t bg-muted/30 p-3">
        <label htmlFor={stepperId} className="text-xs font-medium text-muted-foreground">
          Quantidade
        </label>
        <QuantityStepper
          inputId={stepperId}
          value={quantity}
          max={TEST_QUANTITY_LIMIT}
          disabled={outOfStock}
          onChange={(next) => setQuantity(product, next)}
        />
      </CardFooter>
    </Card>
  );
}
