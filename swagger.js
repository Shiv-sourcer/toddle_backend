const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Journal API',
      version: '1.0.0',
      description: 'API documentation for the Journal Management System',
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
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
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./routes/*.js', './models/*.js'], // paths to your route files for Swagger comments
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
