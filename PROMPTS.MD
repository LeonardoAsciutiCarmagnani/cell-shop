## Prompt 1 - Utilizado para criação da interface do front-end, utilizando ShadCn e Tailwind:

### Detalhe: Como a aplicação possui uma rota para documentação, foi possível criar um MCP com a API criada

### para trazer mais contexto em relação a schemas, contratos e retornos, diretamente no agente.

/caveman Assuma o papel de um engenheiro de software sênior responsável pela construção do front-end da aplicação CellShop.

Contexto:

- Você está trabalhando em um monorepo, e a API já está pronta.
- Utilize os schemas e contratos existentes da API como fonte de verdade.
- Consulte a documentação disponível no MCP: "CellShop API Installation".
- Não invente estruturas: respeite exatamente o formato esperado pela API.

Objetivo:

- Construir uma aplicação front-end com foco em simplicidade, clareza e boa experiência do usuário, evitando complexidade desnecessária.

Telas principais:

1. Vitrine de Produtos
   Listar todos os produtos retornados pela API (sem paginação).
   Cada produto deve ter:
   - Nome
   - Preço
   - Estoque
   - Input numérico de quantidade
   - Botões de incremento (+) e decremento (-)
   - Inicialmente, não utilizar imagens.

Regras:
Produtos com estoque 0 devem:

- Estar em gray-scale
- Exibir badge de "Indisponível"
- Ter input e botões desabilitados

Checkout:
Exibir:

- Lista de produtos selecionados
- Quantidade
- Valor unitário
- Valor total do pedido
  Ações:
- Continuar comprando
- Finalizar compra

Finalizar compra

- Deve enviar a requisição exatamente no formato esperado pela API
- Exibir a resposta da API para o usuário (mensagem de sucesso ou erro)

Carrinho:

- Implementar um carrinho simples baseado em estado global

Header:

- Exibir uma badge com a quantidade total de itens
  Ao clicar:
- Abrir um popover contendo:
- Lista de produtos
- Quantidade
- Valor total
- Botão para ir ao checkout

Importante:

- O carrinho é somente visualização
- Não permitir alterar quantidades ou remover itens dentro dele
- Header:
- Criar um header elegante contendo:
- Nome da aplicação: CellShop
- Ícone do carrinho com badge
- UX e Estados
- Implementar loading states em todas as ações assíncronas
  Durante requisições:
- Desabilitar botões de submit
- Evitar múltiplos envios (duplicidade)
- Sempre fornecer feedback claro ao usuário (sucesso/erro)

Priorizar:

- Simplicidade
- Legibilidade
- Manutenibilidade

Evitar:

- Abstrações desnecessárias
- Overengineering

Stack:

- React + TypeScript
- Tailwind CSS v4
- Consultar MCP Context7 para setup e uso correto
- ShadCN UI
- Utilizar componentes prontos sempre que possível
- Consultar MCP shadcn

Regras de implementação:

- Não criar lógica complexa para o carrinho
- Evitar duplicação de estado
- Garantir consistência entre UI e estado global
- Seguir fielmente os contratos da API

## Prompt 2 - Utilizado para rastreamento de alterações, criação de commits e padronização utilizando conventional commits.

Assuma o papel de um engenheiro de software sênior responsável por revisar alterações de código, organizar commits e realizar o versionamento de forma profissional.

## Objetivo

Analisar todas as alterações atuais no repositório e:

1. Entender o que foi modificado
2. Agrupar mudanças por **tema e intenção**
3. Criar commits bem estruturados
4. Garantir que nada quebrado seja commitado
5. Realizar o push para o repositório remoto

## Processo obrigatório (seguir em ordem)

### 1. Análise das alterações

- Verificar o estado atual do repositório (`git status`, `git diff`)
- Identificar:
  - Novos arquivos
  - Arquivos modificados
  - Arquivos deletados
- Entender o propósito de cada mudança antes de agir

### 2. Agrupamento inteligente

Agrupar alterações em commits baseados em intenção:

- `feat`: nova funcionalidade
- `fix`: correção de bug
- `refactor`: melhoria interna sem mudança de comportamento
- `style`: ajustes visuais/estéticos
- `chore`: configuração ou manutenção
- `test`: testes

#### Regras

- Nunca misturar tipos diferentes no mesmo commit
- Um commit deve ter **uma única responsabilidade clara**
- Evitar commits grandes ou genéricos

### 3. Validação antes do commit

Antes de criar qualquer commit:

- Garantir que o projeto builda corretamente
- Verificar erros óbvios de código
- Remover:
  - `console.log` desnecessários
  - Código comentado inútil
  - Arquivos temporários
- Garantir consistência entre arquivos alterados

> Se houver problema, **corrigir antes de continuar**

### 4. Criação dos commits (OBRIGATÓRIO: Conventional Commits)

Todos os commits devem seguir **estritamente** o padrão Conventional Commits.

#### Formato obrigatório

tipo(escopo): descrição curta no imperativo

#### Exemplos válidos

- feat(cart): adiciona lógica de carrinho
- fix(checkout): corrige envio de payload
- refactor(header): simplifica estrutura do componente

#### Regras obrigatórias

- Usar verbo no imperativo (ex: "adiciona", "corrige", "remove")
- Ser específico e direto
- Nunca usar mensagens genéricas como:
  - update
  - changes
  - fix stuff

#### Opcional

- Adicionar descrição mais detalhada abaixo da linha principal, se necessário

### 5. Ordem dos commits

- Organizar commits de forma lógica (base → feature → ajustes)
- Garantir que cada commit seja funcional isoladamente (quando possível)

### 6. Push

- Após validar todos os commits:
  - Realizar push para a branch atual

Se o nome da branch estiver inadequado:

- Sugerir um nome melhor seguindo o padrão:
  - feat/...
  - fix/...
  - refactor/...

## Restrições importantes

- Nunca commitar código quebrado
- Nunca agrupar mudanças não relacionadas
- Nunca gerar commits vagos
- Nunca ignorar erros evidentes
- Nunca violar o padrão Conventional Commits

## Saída esperada

- Lista dos commits criados (em ordem)
- Explicação do agrupamento de cada commit
- Confirmação do push realizado

## Comportamento esperado

Se houver dúvida:

- Tomar a decisão mais lógica e consistente
- Priorizar clareza, histórico limpo e manutenibilidade
