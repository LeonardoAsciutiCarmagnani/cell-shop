import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import {
  useCartCount,
  useCartItems,
  useCartTotal,
} from '@/store/cart';
import { formatCurrency } from '@/lib/utils';

export function CartPopover() {
  const [open, setOpen] = useState(false);
  const items = useCartItems();
  const count = useCartCount();
  const total = useCartTotal();
  const navigate = useNavigate();
  const isEmpty = items.length === 0;

  const handleCheckout = () => {
    setOpen(false);
    navigate('/checkout');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative h-10 w-10 rounded-full"
          aria-label={`Carrinho com ${count} ${count === 1 ? 'item' : 'itens'}`}
        >
          <ShoppingCart className="size-5" />
          {count > 0 && (
            <Badge
              variant="default"
              className="absolute -right-1.5 -top-1.5 h-5 min-w-5 rounded-full px-1.5 text-[10px] tabular-nums shadow-md"
            >
              {count > 99 ? '99+' : count}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[22rem] p-0" align="end">
        <div className="flex items-center justify-between gap-3 p-4">
          <div>
            <p className="text-sm font-semibold">Seu carrinho</p>
            <p className="text-xs text-muted-foreground">
              {count} {count === 1 ? 'item adicionado' : 'itens adicionados'}
            </p>
          </div>
          <ShoppingBag className="size-5 text-muted-foreground" />
        </div>
        <Separator />

        {isEmpty ? (
          <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
            <ShoppingBag className="size-10 text-muted-foreground/60" />
            <p className="text-sm font-medium">Carrinho vazio</p>
            <p className="text-xs text-muted-foreground">
              Adicione produtos para vê-los aqui.
            </p>
          </div>
        ) : (
          <ul className="max-h-72 divide-y overflow-y-auto">
            {items.map((item) => (
              <li key={item.sku} className="flex items-start gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium leading-tight">
                    {item.name}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {item.quantity} × {formatCurrency(item.price)}
                  </p>
                </div>
                <span className="text-sm font-semibold tabular-nums">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
        )}

        <Separator />
        <div className="space-y-3 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total</span>
            <span className="text-lg font-semibold tabular-nums">
              {formatCurrency(total)}
            </span>
          </div>
          <Button
            className="w-full"
            size="lg"
            disabled={isEmpty}
            onClick={handleCheckout}
          >
            Finalizar e ir para o checkout
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
