
import swaggerJsdoc from 'swagger-jsdoc'

export const options: swaggerJsdoc.Options = {
  swaggerDefinition: {
    openapi: '3.0.1',
    info: {
      version: '1.0.0',
      title: 'Express Typescript Restful Api',
      description: 'Create Restful Apis'
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
        description: 'Development server'
      },
      {
        url: 'https://staging-server.com/api/v1',
        description: 'Staging server'
      },
      {
        url: 'https://production-server.com/api/v1',
        description: 'Production server'
      }
    ],
    components: {
      schemas: {
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string'
            }
          }
        }
      },
      parameters: {
        id: {
          in: 'path',
          name: 'id',
          schema: {
            type: 'integer'
          },
          required: true
        }
      },
      responses: {
        GenericError: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  // List of files to be processes. You can also set globs './routes/*.js'
  apis: ['src/routes/*.ts']
}
