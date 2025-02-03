import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'FAQ API',
            version: '1.0.0',
            description: 'API documentation for the FAQ project',
        },
        servers: [
            {
                url: process.env.SERVER_URL,
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
    },
    apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Paths to files containing OpenAPI definitions
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
        swaggerOptions: {
            authAction: {
                bearerAuth: {
                    name: "bearerAuth",
                    schema: {
                        type: "http",
                        in: "header",
                        name: "Authorization",
                        description: "",
                    },
                    value: "Bearer <JWT>"
                }
            }
        }
    }));
};
