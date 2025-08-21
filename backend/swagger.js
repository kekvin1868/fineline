// filepath: backend/swagger.js
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FineLine API',
      version: '1.0.0',
      description: 'API documentation for the FineLine application.',
    },
    servers: [
      {
        url: `http://localhost:3000`,
        description: 'Development server',
      },
    ],
  },
  // Path to the API docs
  apis: ['./swagger-docs/*.yaml'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;