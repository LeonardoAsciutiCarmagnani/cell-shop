# Cell Shop

Monorepo da aplicação Cell Shop, com serviços backend e frontend para execução em ambiente local de desenvolvimento.

## Pré-requisitos

Antes de iniciar, garanta que você tenha instalado:

- `Node.js` **20+**
- `pnpm` **9+** (recomendado: `pnpm@10.11.0`)

## Primeira execução (setup inicial)

No diretório raiz do projeto, execute os comandos abaixo **na ordem**:

```bash
pnpm setup:initialize
pnpm setup:env
pnpm dev
```

### O que cada comando faz

- `pnpm setup:initialize`: instala todas as dependências do monorepo.
- `pnpm setup:env`: cria o arquivo `.env` automaticamente a partir de `.env.example`.
- `pnpm dev`: inicia os projetos em modo de desenvolvimento.

## Scripts úteis

- `pnpm build`: gera build de todos os pacotes.
- `pnpm typecheck`: executa checagem de tipos em todos os pacotes.
- `pnpm lint`: roda análise estática com ESLint.
- `pnpm lint:fix`: corrige automaticamente problemas de lint quando possível.
- `pnpm format`: formata os arquivos com Prettier.
- `pnpm format:check`: valida formatação sem alterar arquivos.

# Trade-offs e decisões

- O estoque é mantido em memória para simplificar a implementação e focar no fluxo de checkout
- Não há controle de concorrência real, pois não é o objetivo da aplicação
- A vitrine não possui paginação para reduzir complexidade no front-end
- O carrinho foi mantido simples (somente visualização) para evitar lógica desnecessária
- - A API aplica DIP para reduzir acoplamento entre regras de negócio e infraestrutura
