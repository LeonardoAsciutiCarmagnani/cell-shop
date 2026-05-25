import { AlertTriangle, PackageSearch, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductCard } from '@/components/product-card';
import { useProducts } from '@/hooks/use-products';
import { ApiError } from '@/lib/api';

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="flex flex-col gap-3 rounded-lg border bg-card p-4 shadow-sm">
          <Skeleton className="aspect-[4/3] w-full rounded-md" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="mt-2 h-9 w-full" />
        </div>
      ))}
    </div>
  );
}

export function ShowcasePage() {
  const { data, isLoading, isError, error, refetch, isFetching } = useProducts();

  console.log(data);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-8 flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Vitrine
        </span>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Capinhas para todos os celulares
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Escolha a quantidade ideal e adicione direto ao carrinho.
        </p>
      </header>

      {isLoading && <ProductGridSkeleton />}

      {isError && (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-8 text-center">
          <AlertTriangle className="size-8 text-destructive" />
          <p className="text-base font-semibold">Não foi possível carregar os produtos</p>
          <p className="max-w-md text-sm text-muted-foreground">
            {error instanceof ApiError ? error.message : 'Verifique sua conexão e tente novamente.'}
          </p>
          <Button onClick={() => refetch()} disabled={isFetching}>
            <RefreshCcw className={isFetching ? 'animate-spin' : ''} />
            Tentar novamente
          </Button>
        </div>
      )}

      {data && data.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-12 text-center">
          <PackageSearch className="size-10 text-muted-foreground" />
          <p className="text-base font-semibold">Vitrine vazia</p>
          <p className="text-sm text-muted-foreground">Nenhum produto disponível no momento.</p>
        </div>
      )}

      {data && data.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.map((product) => (
            <ProductCard key={product.sku} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
