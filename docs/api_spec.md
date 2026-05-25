# SDD - Cell Shop API

Documento funcional da API do Case Cell Shop.

## Escopo

- API HTTP para vitrine de produtos e checkout.
- Estoque em memória (sem persistência em banco).
- Foco no fluxo principal de consulta e compra.

## Endpoints

### 1) Healthcheck

#### `GET /health`

Verifica disponibilidade da API.

**Response `200 - OK`**

```json
{
  "status": "ok"
}
```

---

### 2) Vitrine de Produtos

#### `GET /products`

Retorna todos os produtos disponíveis no catálogo mock.

**Regras de negócio**

- A listagem retorna todos os itens do catálogo.
- Em caso de falha de leitura do catálogo, retorna indisponibilidade.

**Responses**

**`200 - OK`**

```json
[
  {
    "id": 1,
    "sku": "CAP-APL-IP15-SIL-BLK",
    "name": "Capinha Silicone Apple iPhone 15 - Preta",
    "price": 59.9,
    "stock": 8
  }
]
```

**`503 - Service Unavailable`**

```json
{
  "error": {
    "code": "CATALOG_UNAVAILABLE",
    "message": "Não foi possível carregar os produtos da vitrine. Por favor, tente novamente mais tarde."
  }
}
```

---

### 3) Checkout

#### `POST /checkout`

Recebe os itens do pedido, valida o payload, verifica estoque e cria o pedido.

**Regras de negócio**

- O payload deve conter ao menos 1 item.
- Cada item deve conter `sku` válido e `quantity >= 1`.
- Se houver estoque para todos os itens, o estoque é baixado e o pedido é criado.
- Se faltar estoque em qualquer item, o pedido não é concluído.

**Request Body**

```json
{
  "items": [
    {
      "sku": "CAP-APL-IP15-SIL-BLK",
      "quantity": 1
    }
  ]
}
```

**Responses**

**`201 - Created`**

```json
{
  "orderId": "4af5d829-a9ea-4e92-9b7c-70a7057b5e6f",
  "status": "SUCCESS"
}
```

**`400 - Bad Request`**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "O pedido deve conter ao menos um item"
  }
}
```

**`422 - Unprocessable Entity`**

```json
{
  "error": {
    "code": "OUT_OF_STOCK",
    "message": "Estoque insuficiente para o SKU: CAP-APL-IP15-SIL-BLK."
  }
}
```

**`503 - Service Unavailable`**

```json
{
  "error": {
    "code": "CHECKOUT_UNAVAILABLE",
    "message": "Não foi possível processar seu pedido agora. Tente novamente mais tarde."
  }
}
```

## Estruturas de resposta de erro

Todas as respostas de erro seguem o padrão:

```json
{
  "error": {
    "code": "STRING_CODE",
    "message": "Mensagem legível",
    "details": {
      "campoOpcional": ["detalhe opcional"]
    }
  }
}
```

`details` é opcional.

