import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Coinbase Clone API',
      version: '1.0.0',
      description: 'API documentation for Coinbase Clone backend. Includes authentication, cryptocurrency data, and user profile endpoints.',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'User ID' },
            email: { type: 'string', format: 'email', description: 'User email' },
            name: { type: 'string', description: 'User name' },
            createdAt: { type: 'string', format: 'date-time', description: 'Account creation timestamp' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            token: { type: 'string', description: 'JWT authentication token' },
            user: { $ref: '#/components/schemas/User' },
          },
        },
        Crypto: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            symbol: { type: 'string' },
            price: { type: 'number' },
            change_24h: { type: 'number' },
            category: { type: 'string' },
            image: { type: 'string' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
    tags: [
      { name: 'Authentication', description: 'User registration and login' },
      { name: 'Crypto', description: 'Cryptocurrency data endpoints' },
      { name: 'Health', description: 'Health check endpoint' },
    ],
  },
  apis: ['./routes/*.js', './server.js'],
};

const specs = swaggerJsdoc(options);

export default specs;
