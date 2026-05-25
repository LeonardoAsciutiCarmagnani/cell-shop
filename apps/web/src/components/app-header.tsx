import { Link } from 'react-router-dom';
import { CartPopover } from './cart-popover';
import { BookTextIcon } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          to="/"
          className="group flex items-center gap-2.5"
          aria-label="Ir para vitrine de produtos"
        >
          <span className="flex flex-col leading-none">
            <span className="text-3xl font-bold tracking-tight">CellShop</span>
          </span>
        </Link>
        <div className="flex items-center gap-12">
          <a
            href="http://localhost:3000/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2.5"
            aria-label="Ir para documentação da API"
          >
            <span
              className="flex gap-x-1
            "
            >
              <BookTextIcon className="size-5" />
              <span className="text-sm font-bold tracking-tight">API Docs</span>
            </span>
          </a>

          <CartPopover />
        </div>
      </div>
    </header>
  );
}
