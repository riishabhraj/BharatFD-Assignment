"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const environment = process.env.ENV || 'production';
const logLevel = environment === 'production' ? 'info' : 'debug';
const config = {
    console: {
        format: winston_1.default.format.combine(winston_1.default.format.errors({ stack: true }), winston_1.default.format.splat(), winston_1.default.format.colorize(), winston_1.default.format.simple())
    },
    file: {
        level: logLevel,
        filename: 'logs/log.log',
        maxsize: 5000000, // 5MB
        maxFiles: 5,
        format: winston_1.default.format.combine(winston_1.default.format.errors({ stack: true }), winston_1.default.format.splat(), winston_1.default.format.uncolorize(), winston_1.default.format.simple())
    }
};
const logger = winston_1.default.createLogger({
    level: logLevel,
    format: winston_1.default.format.simple(),
    transports: [
        new winston_1.default.transports.Console(Object.assign({}, config.console, environment === 'production' ? { level: 'error' } : {})),
        new winston_1.default.transports.File(Object.assign({}, config.file, {
            level: 'error',
            filename: 'logs/error.log'
        })),
        new winston_1.default.transports.File(Object.assign({}, config.file, { filename: 'logs/combined.log' }))
    ],
    exitOnError: false
});
// @ts-ignore
logger.stream = {
    write: (message) => {
        logger.debug(message.trim());
    }
};
exports.default = logger;
