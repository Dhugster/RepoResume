const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RepoResume API Documentation',
      version: '1.0.0',
      description: 'API documentation for RepoResume - Intelligent GitHub Repository Analyzer',
      contact: {
        name: 'RepoResume Support',
        email: 'support@reporesume.dev'
      }
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3001',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'connect.sid'
        },
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            username: { type: 'string' },
            email: { type: 'string' },
            avatar_url: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        Repository: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            github_id: { type: 'string' },
            name: { type: 'string' },
            full_name: { type: 'string' },
            description: { type: 'string' },
            url: { type: 'string' },
            language: { type: 'string' },
            stars: { type: 'integer' },
            forks: { type: 'integer' },
            health_score: { type: 'number' },
            last_analyzed_at: { type: 'string', format: 'date-time' }
          }
        },
        Task: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            title: { type: 'string' },
            description: { type: 'string' },
            priority_score: { type: 'number' },
            category: { type: 'string' },
            status: { type: 'string' },
            file_path: { type: 'string' },
            line_number: { type: 'integer' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' },
            details: { type: 'object' }
          }
        }
      }
    },
    tags: [
      { name: 'Authentication', description: 'Authentication endpoints' },
      { name: 'Repositories', description: 'Repository management' },
      { name: 'Tasks', description: 'Task management' },
      { name: 'Analysis', description: 'Code analysis' },
      { name: 'Export', description: 'Export functionality' },
      { name: 'Users', description: 'User management' }
    ]
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js']
};

const specs = swaggerJsdoc(options);

const swaggerSetup = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'RepoResume API Documentation'
  }));
};

module.exports = swaggerSetup;
