### Observação de escopo
Para fins deste desafio, a implementação prática utilizará dados em memória, conforme sugerido no enunciado.
As estratégias descritas neste documento (como uso de cache com Redis e atualização assíncrona) representam uma evolução arquitetural pensada para cenários de alta escala, não sendo obrigatórias para a mini-tarefa.

# 1. Vitrine de Produtos

## `GET /products`

### Contexto

Retorna a lista de produtos disponíveis para venda com baixa latência, utilizando cache para otimizar performance.
Essa rota consome dados de um cache (Redis), desacoplando a leitura do ERP.

### Regras de negócio

- A listagem deve ser retornada prioritariamente a partir do cache (Redis)
- O sistema deve tolerar inconsistência eventual dos dados
- O ERP é a fonte de verdade, porém não deve ser acessado diretamente em alta escala
- O sistema deve continuar operando mesmo em caso de indisponibilidade temporária do ERP
- O cache deve possuir TTL como mecanismo de segurança, não como estratégia de atualização

### Fluxo

1. Requisição recebida
2. Consulta ao Redis
3. Caso sucesso (cache hit) → retorna dados do cache
4. Caso falha (miss)
- Tenta adquirir lock de reconstrução de cache
  - Caso lock adquirido:
    - Consulta ERP
    - Atualiza cache
    - Retorna dados
  - Caso lock não adquirido:
    - Retorna erro controlado

### Estratégia de Cache

- Tipo: Cache-aside
- Armazenamento: Redis
- TTL: 5 minutos (fallback de expiração)
- Atualização: assíncrona (background refresh)

## Mecanismo de atualização de cache

- Um processo assíncrono é responsável por manter o cache aquecido
- A atualização ocorre de forma periódica
- O cache pode ser atualizado antes do TTL expirar
- Apenas uma instância por vez pode reconstruir o cache

## Estratégia de resiliência

- Em caso de indisponibilidade do ERP:
 - O sistema deve continuar servindo dados do cache, mesmo que desatualizados, por um período controlado
 - Após esse limite, deve retornar erro controlado

---

### Responses

#### **200 - OK**

```json
[
  {
    "sku": "CAP-IPH15-PRT",
    "name": "Capinha Silicone Apple iPhone 15 - Preta",
    "price": 59.90,
    "stock": 42
  }
]
```

---

#### **503 - Service Unavailable**

Quando não há dados disponíveis em cache e não foi possível obter dados do ERP.

```json
{
  "error": {
    "code": "CATALOG_UNVAILABLE",
    "message": "Não foi possível carregar os produtos. Por favor, tente novamente em instantes."
  }
}
```

---

# 2. Checkout

## `POST /checkout`

### Contexto

Recebe uma intenção de compra e inicia o processamento assíncrono do pedido, garantindo consistência e evitando duplicidade de processamento.

### Headers

- `Idempotency-Key` *(string, UUID, obrigatório)*  
Chave única para evitar dupla cobrança.

### Regras de negócio

- O customerId deve ser válido
- Todos os SKUs devem existir no catálogo
- A quantidade de cada item deve ser maior que 0
- O estoque deve ser reservado de forma atômica
- Não deve ser possível criar múltiplos pedidos com a mesma `Idempotency-Key`
- O pedido só será considerado finalizado após confirmação do ERP

### Garantias do sistema (Idempotência)

- A `Idempotency-Key` deve ser gerada no momento da tentativa de checkout e reutilizada em eventuais retries da mesma operação
- Todas as `Idempotency-Key` devem ser armazenadas com TTL de 24 horas.
- Requisições com mesma key e mesmo payload retornam a mesma resposta
- Requisições com mesma key e payload diferente retornam erro `409 - Conflict`
- Nenhuma duplicidade de processamento deve ocorrer

### Fluxo

1. Recebe requisição
2. Valida schema do request
3. Verifica idempotência
4. Valida existência dos SKUs
5. Realiza reserva atômica de estoque via operação transacional
6. Calcula o valor total e cria pedido com status `PENDING`
7. Publica mensagem na fila de processamento
8. Retorna resposta ao cliente

### Request Body

```json
{
  "customerId": "string (uuid)",
  "items": [
    {
      "sku": "string",
      "quantity": "integer (min: 1)"
    }
  ]
}
```

### Responses

#### **202 - Accepted**

O pedido passou pelas validações básicas, o estoque local foi reservado com sucesso e a tarefa foi encaminhada para a fila de processamento.

*Nota de Idempotência: Se o cliente enviar novamente a mesma `Idempotency-Key` com o mesmo payload, a API retornará o status `202`  com `orderId`*
*gerado na primeira requisição, sem novo enfileiramento* 

```json
{
  "orderId": "string",
  "status": "PENDING",
  "statusUrl": "/orders/{orderId}"
}
```

---

#### **400 - Bad Request**

Os dados enviados não respeitam o schema esperado.

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "O valor do campo x precisa ser maior que y."
  }
}
```

---

#### **409 - Conflict**

Existe uma `Idempotency-Key` salva com outro payload

```json
{
  "error": {
    "code": "IDEMPOTENCY_KEY_ALREADY_EXISTS",
    "message": "Já existe outro pedido com a mesma chave idempotente."
  }
}
```

---

#### **422 - Unprocessable Entity**

A reserva atômica no banco local falhou porque a quantidade solicitada é maior que a disponível.

```json
{
  "error": {
    "code": "OUT_OF_STOCK",
    "message": "Estoque insuficiente para o SKU: XYZ-123."
  }
}
```

---

#### **422 - Unprocessable Entity**

O SKU informado não existe no banco de dados.

```json
{
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "O produto informado não pôde ser localizado em nosso catálogo."
  }
}
```

---

#### **500 - Internal Server Error**

Erro inesperado ao salvar o pedido ou tentar adicioná-lo à fila interna.

```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Houve uma falha interna ao tentar iniciar seu checkout. Nenhuma cobrança foi realizada."
  }
}
```

# 3. Status do pedido

## `GET /orders/:id`

### Contexto

Permite consultar o estado atual do pedido. O front-end deve utilizar essa rota para realizar polling até a finalização do processamento.

### Estados do pedido

- `PENDING` → processamento em andamento
- `CONFIRMED` → pedido finalizado com sucesso
- `FAILED` → falha definitiva no processamento

### Transições de estado

- `PENDING` → `CONFIRMED`
- `PENDING` → `FAILED`

### Regras de negócio

- O pedido deve existir
- Enquanto estiver em `PENDING`, o cliente deve continuar realizando polling
- O sistema deve informar intervalo mínimo entre requisições via header `Retry-After`
- Após falha definitiva, o pedido não deve ser reprocessado automaticamente
- Em caso de falha, a saída em estoque deverá ser revertida

### Fluxo

1. Cliente consulta `/orders/:id`
2. Sistema verifica status do pedido
3. Retorna estado atual
4. Caso `PENDING`, inclui header `Retry-After`
5. Cliente repete processo até estado final

### Estratégia de Retry (Worker)

- Tentativas de integração com ERP: até 5 vezes
- Backoff: exponencial
- Após limite → status `FAILED`

### Responses

#### **200 - OK (Processando)**

**O worker está tentando realizar a comunicação ou realizando retentativas, o front-end deve continuar exibindo Loading**

*Importante: A presença do header `Retry-After` indica o tempo mínimo de espera para o próximo polling.*

Header: Retry-After: 5

```json
{
  "orderId": "ord_xyz",
  "status": "PENDING",
  "total": 119.80,
  "errorMessage": null
}
```

---

#### **200 - OK (Sucesso)**

**O pedido foi enviado com sucesso para o ERP e o faturamento foi confirmado, o front-end deve redirecionar o usuário**

```json
{
  "orderId": "ord_xyz",
  "status": "CONFIRMED",
  "total": 119.80,
  "errorMessage": null
}
```

---

#### **200 - OK (Falha final)**

**A API do ERP rejeitou o pedido ou permaneceu inoperante após o limite de retentativas.**

```json
{
  "orderId": "ord_xyz",
  "status": "FAILED",
  "total": 119.80,
  "errorMessage": "Não foi possível processar o pedido após múltiplas tentativas."
}
```

---

#### **404 - Not found**

**O ID do pedido informado não existe na base de dados**

```json
{
"error": {
    "code": "ORDER_NOT_FOUND",
    "message": "O pedido informado não foi encontrado em nosso sistema."
}
}
```

