# Especificação Técnica de API (SDD Simplificado) — CaseCellShop

Este documento apresenta a especificação técnica dos endpoints da API desenvolvida para resolver os principais gargalos de negócio da CaseCellShop. O design prioriza a simplicidade e a eficiência através de simulações e processamentos em memória (*In-Memory Data Structures*), dispensando dependências de infraestrutura complexa externa para o escopo deste projeto, sem abrir mão do tratamento rigoroso de erros e consistência.

---

## 1. Vitrine de Produtos

### `GET /products`

#### Contexto e Resolução de Problema
Resolve o **Problema 1 (Performance da Vitrine)**. Para evitar requisições síncronas e pesadas ao banco de dados do ERP a cada acesso à página inicial, a API expõe os dados diretamente de uma estrutura otimizada mantida em memória local. Isso garante tempo de resposta imediato e estabilidade para suportar picos de acessos.

#### Regras de Negócio
- A listagem deve retornar instantaneamente a partir do estado local da aplicação.
- O estoque exibido reflete em tempo real as reservas feitas pelas intenções de checkout ativas.

#### Responses

##### **200 OK**
Retorna a lista completa de produtos disponíveis em catálogo.

```json
[
  {
    "sku": "CAP-IPH15-PRT",
    "name": "Capinha Silicone Apple iPhone 15 - Preta",
    "price": 59.90,
    "stock": 42
  },
  {
    "sku": "CAP-GALAS24-TRP",
    "name": "Capinha Antishock Samsung Galaxy S24 - Transparente",
    "price": 49.90,
    "stock": 15
  }
]
```

##### **503 Service Unavailable**

Retornado caso ocorra alguma falha na leitura da estrutura de dados global da vitrine.

```json
{
  "error":{
    "code": "CATALOG_UNAVAILABLE",
    "message": "Não foi possível carregar os produtos. Por favor, tente novamente mais tarde."
  }
}
```

---

## 2. Processamento do Checkout

### `POST /checkout`

#### Contexto e Resolução de Problema
Resolve de forma concorrente o **Problema 2 (Furo de Estoque)** e o **Problema 3 (Timeout no Checkout devido à lentidão do ERP)**.
1. **Furo de Estoque:** É mitigado através de uma validação e mutação de estado síncrona e imediata na memória assim que a requisição é recebida. Se houver estoque disponível, ele é reservado na hora.
2. **Timeout:** É resolvido através do **desacoplamento assíncrono**. A API cria o pedido com status `PENDING`, responde imediatamente ao cliente e delega a comunicação real com o ERP para um processo em background.

#### Regras de Negócio & Validações
- O payload deve conter dados válidos de cliente (`customerId`), SKU e a quantidade do item deve ser de no mínimo 1.
- **Validação Crítica de Estoque:** Caso a quantidade solicitada seja maior que a disponível no estoque em memória, a requisição é rejeitada instantaneamente.
- **Idempotência Simplificada:** A API rastreia em memória os identificadores de requisições de sucesso para evitar reprocessamentos indesejados de um mesmo clique.

#### Request Body
```json
{
  "customerId": "usr_94a2b1",
  "sku": "CAP-IPH15-PRT",
  "quantity": 2
}
```

#### Responses

##### **202 Accepted**
Pedido recebido e processamento em background iniciado.
```json
{
  "orderId": "ord_881923",
  "status": "PENDING",
  "message": "Seu pedido foi recebido e está sendo processado."
}
```

##### **400 Bad Request**
Dados inválidos informados no corpo da requisição.
```json
{
  "error": "A quantidade solicitada deve ser igual ou superior a 1."
}
```

##### **422 Unprocessable Entity**
Falha em regra de negócio devido a produto não localizado ou falta de estoque.
```json
{
  "error": "Estoque insuficiente para o produto informado. Estoque atual: 1."
}
```

---

## 3. Consulta de Status do Pedido (Polling)

### `GET /orders/:id`

#### Contexto e Resolução de Problema
Como o processamento do checkout ocorre de forma assíncrona em background (simulado via rotinas temporizadas na aplicação), a interface do usuário utilizará este endpoint para consultar o andamento do pedido até que ele chegue a um estado final.

#### Ciclo de Vida do Pedido
- **`PENDING`:** O processo em background ainda está simulando a comunicação e faturamento junto ao ERP. O front-end deve manter um estado visual de carregamento (*loading*).
- **`CONFIRMED`:** A integração obteve sucesso. O front-end deve direcionar o cliente para a tela de sucesso da compra.
- **`FAILED`:** O processamento falhou. A interface exibe o erro e o sistema **devolve automaticamente** a quantidade de estoque que havia sido reservada de volta ao catálogo global.

#### Responses

##### **200 OK**
Retorna o estado atualizado do pedido pesquisado.
```json
{
  "orderId": "ord_881923",
  "status": "PENDING",
  "sku": "CAP-IPH15-PRT",
  "quantity": 2,
  "updatedAt": "2026-05-23T20:55:00Z"
}
```

##### **404 Not Found**
O código do pedido informado não existe no histórico em memória.
```json
{
  "error": "O código de pedido informado não existe no sistema."
}
```