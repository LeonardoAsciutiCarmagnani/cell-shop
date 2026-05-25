export const openApiDocument = {
  openapi: '3.1.0',
  info: {
    title: 'Cell Shop API',
    version: '1.0.0',
    description: 'Documentação da API do CaseCellShop - Mini-tarefa de Código',
  },
  paths: {
    '/health': {
      get: {
        summary: 'Verifica o status da API',
        responses: {
          '200': {
            description: 'API disponível',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/HealthResponse' },
              },
            },
          },
        },
      },
    },
    '/products': {
      get: {
        summary: 'Lista todos os produtos da vitrine',
        responses: {
          '200': {
            description: 'Produtos retornados com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Product' },
                },
              },
            },
          },
          '503': {
            description: 'Falha para carregar o catálogo',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/checkout': {
      post: {
        summary: 'Cria um pedido e baixa estoque',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CheckoutInput' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Pedido criado com sucesso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CheckoutResult' },
              },
            },
          },
          '400': {
            description: 'Payload inválido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '422': {
            description: 'Estoque insuficiente',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '503': {
            description: 'Falha ao processar pedido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      HealthResponse: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'ok',
          },
        },
        required: ['status'],
      },
      Product: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          sku: { type: 'string' },
          name: { type: 'string' },
          price: { type: 'number' },
          stock: { type: 'number' },
        },
        required: ['id', 'sku', 'name', 'price', 'stock'],
      },
      CheckoutItemInput: {
        type: 'object',
        properties: {
          sku: { type: 'string' },
          quantity: { type: 'number', minimum: 1 },
        },
        required: ['sku', 'quantity'],
      },
      CheckoutInput: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            minItems: 1,
            items: { $ref: '#/components/schemas/CheckoutItemInput' },
          },
        },
        required: ['items'],
      },
      CheckoutResult: {
        type: 'object',
        properties: {
          orderId: { type: 'string' },
          status: { type: 'string', enum: ['SUCCESS'] },
        },
        required: ['orderId', 'status'],
      },
      ErrorPayload: {
        type: 'object',
        properties: {
          code: { type: 'string' },
          message: { type: 'string' },
          details: {
            type: 'object',
            additionalProperties: {
              type: 'array',
              items: { type: 'string' },
            },
          },
        },
        required: ['code', 'message'],
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          error: { $ref: '#/components/schemas/ErrorPayload' },
        },
        required: ['error'],
      },
    },
  },
} as const;
