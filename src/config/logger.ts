import winston from 'winston';
import dotenv from 'dotenv';

dotenv.config();

const environment: string = process.env.ENV || 'production';
const logLevel: string = environment === 'production' ? 'info' : 'debug';

const config = {
    console: {
        format: winston.format.combine(
            winston.format.errors({ stack: true }),
            winston.format.splat(),
            winston.format.colorize(),
            winston.format.simple()
        )
    },
    file: {
        level: logLevel,
        filename: 'logs/log.log',
        maxsize: 5000000, // 5MB
        maxFiles: 5,
        format: winston.format.combine(
            winston.format.errors({ stack: true }),
            winston.format.splat(),
            winston.format.uncolorize(),
            winston.format.simple()
        )
    }
};

const logger: winston.Logger = winston.createLogger({
    level: logLevel,
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console(
            Object.assign(
                {},
                config.console,
                environment === 'production' ? { level: 'error' } : {}
            )
        ),
        new winston.transports.File(
            Object.assign({}, config.file, {
                level: 'error',
                filename: 'logs/error.log'
            })
        ),
        new winston.transports.File(
            Object.assign({}, config.file, { filename: 'logs/combined.log' })
        )
    ],
    exitOnError: false
});

// @ts-ignore
logger.stream = {
    write: (message: string) => {
        logger.debug(message.trim());
    }
} as unknown as NodeJS.WritableStream;

export default logger;
