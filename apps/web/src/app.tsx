import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AppHeader } from '@/components/app-header';
import { Toaster } from '@/components/ui/sonner';
import { CheckoutPage } from '@/pages/checkout-page';
import { ShowcasePage } from '@/pages/showcase-page';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppHeader />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<ShowcasePage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <footer className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
          CellShop &middot; Mini-tarefa de Código
        </footer>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}
