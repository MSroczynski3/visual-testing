import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Visual Testing API',
      version: '1.0.0',
      description: 'API documentation for the Visual Testing application',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Product: {
          type: 'object',
          required: ['id', 'name', 'price', 'created_at'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique identifier for the product',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            name: {
              type: 'string',
              description: 'Name of the product',
              example: 'Laptop',
            },
            description: {
              type: 'string',
              nullable: true,
              description: 'Detailed description of the product',
              example: 'High-performance laptop with 16GB RAM',
            },
            price: {
              type: 'number',
              format: 'float',
              description: 'Price of the product',
              example: 999.99,
            },
            image_url: {
              type: 'string',
              nullable: true,
              description: 'URL to the product image',
              example: 'https://example.com/images/laptop.jpg',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the product was created',
              example: '2024-01-01T00:00:00.000Z',
            },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            data: {
              description: 'Response data (null on error)',
              nullable: true,
            },
            error: {
              type: 'string',
              nullable: true,
              description: 'Error message (null on success)',
              example: 'Failed to fetch products',
            },
          },
        },
        ProductListResponse: {
          allOf: [
            { $ref: '#/components/schemas/ApiResponse' },
            {
              type: 'object',
              properties: {
                data: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Product' },
                  nullable: true,
                },
              },
            },
          ],
        },
        ProductResponse: {
          allOf: [
            { $ref: '#/components/schemas/ApiResponse' },
            {
              type: 'object',
              properties: {
                data: {
                  $ref: '#/components/schemas/Product',
                  nullable: true,
                },
              },
            },
          ],
        },
        HealthResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              description: 'Health check status',
              example: 'ok',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
              example: 'Not found',
            },
          },
        },
      },
    },
  },
  apis: ['./src/index.ts', './src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);

