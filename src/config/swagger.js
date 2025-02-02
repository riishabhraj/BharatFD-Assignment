"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
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
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
const setupSwagger = (app) => {
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec, {
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
exports.setupSwagger = setupSwagger;
