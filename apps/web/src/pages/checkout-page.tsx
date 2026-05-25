import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle2, Loader2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCartItems, useCartStore, useCartTotal } from '@/store/cart';
import { useCheckoutMutation } from '@/hooks/use-checkout';
import { ApiError } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

const MIN_CHECKOUT_PROCESSING_MS = 1200;

export function CheckoutPage() {
  const items = useCartItems();
  const total = useCartTotal();
  const clear = useCartStore((state) => state.clear);
  const navigate = useNavigate();
  const mutation = useCheckoutMutation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const isPending = mutation.isPending || isProcessing;
  const isEmpty = items.length === 0;

  const handleSubmit = async () => {
    if (isPending || isEmpty) return;

    setIsProcessing(true);
    const startAt = Date.now();

    try {
      await mutation.mutateAsync({
        items: items.map((item) => ({
          sku: item.sku,
          quantity: item.quantity,
        })),
      });

      const elapsedMs = Date.now() - startAt;
      const remainingMs = MIN_CHECKOUT_PROCESSING_MS - elapsedMs;

      if (remainingMs > 0) {
        await new Promise((resolve) => window.setTimeout(resolve, remainingMs));
      }

      clear();
      setShowSuccess(true);
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Erro inesperado. Tente novamente.';
      toast.error('Não foi possível finalizar a compra', {
        description: message,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (showSuccess) {
    return (
      <section className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="size-7" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight">Sucesso!</h1>
            <h2 className="text-lg font-medium tracking-tight">
              Seu pedido foi realizado com êxito.
            </h2>

            <Button asChild size="lg" className="mt-2">
              <Link to="/">Voltar para a vitrine</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-6 flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Checkout
        </span>
        <h1 className="text-3xl font-bold tracking-tight">Resumo do pedido</h1>
        <p className="text-sm text-muted-foreground">
          Revise os itens antes de finalizar. As quantidades só podem ser alteradas na vitrine.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3 pb-0">
          <CardTitle className="text-base">
            {items.length} {items.length === 1 ? 'item' : 'itens'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isEmpty ? (
            <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
              <ShoppingBag className="size-10 text-muted-foreground/60" />
              <p className="text-base font-semibold">Carrinho vazio</p>
              <p className="text-sm text-muted-foreground">
                Volte à vitrine para escolher seus produtos.
              </p>
            </div>
          ) : (
            <ul className="divide-y">
              {items.map((item) => (
                <li
                  key={item.sku}
                  className="flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      {item.sku}
                    </p>
                    <p className="truncate text-sm font-semibold leading-snug">{item.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.quantity} × {formatCurrency(item.price)}
                    </p>
                  </div>
                  <span className="text-base font-semibold tabular-nums">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>

        {!isEmpty && (
          <>
            <Separator />
            <CardFooter className="flex items-center justify-between p-6">
              <span className="text-sm text-muted-foreground">Valor total</span>
              <span className="text-2xl font-bold tabular-nums">{formatCurrency(total)}</span>
            </CardFooter>
          </>
        )}
      </Card>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
        <Button variant="outline" size="lg" onClick={() => navigate('/')} disabled={isPending}>
          <ArrowLeft />
          Continuar comprando
        </Button>
        <Button
          size="lg"
          onClick={handleSubmit}
          disabled={isEmpty || isPending}
          aria-busy={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="animate-spin" />
              Processando pedido...
            </>
          ) : (
            'Finalizar compra'
          )}
        </Button>
      </div>
      {isPending && (
        <p className="mt-3 text-sm text-muted-foreground" role="status" aria-live="polite">
          Processando pedido...
        </p>
      )}
    </section>
  );
}
