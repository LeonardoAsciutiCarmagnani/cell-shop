import { useEffect, useState } from 'react';

type HealthResponse = {
  status: string;
};

export function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/health')
      .then((response) => {
        if (!response.ok) {
          throw new Error('API indisponível');
        }

        return response.json() as Promise<HealthResponse>;
      })
      .then(setHealth)
      .catch(() => setError('Não foi possível conectar à API'));
  }, []);

  return (
    <main className="container">
      <h1>TOTVS Desafio Fullstack</h1>
      <p>Vite + React + TypeScript</p>

      {health && <p className="status ok">API: {health.status}</p>}
      {error && <p className="status error">{error}</p>}
    </main>
  );
}
