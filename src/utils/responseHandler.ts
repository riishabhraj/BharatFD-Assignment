import { Response } from 'express';

interface ApiResponse {
    success: boolean;
    data?: any;
    error?: string;
    message?: string;
}

export class ResponseHandler {
    static success(res: Response, data: any, message: string = 'Success', statusCode: number = 200): void {
        const response = {
            success: true,
            data,
            message
        };
        res.status(statusCode).json(response);
    }

    static error(res: Response, error: string, statusCode: number = 500): void {
        const response = {
            success: false,
            error
        };
        res.status(statusCode).json(response);
    }

    static notFound(res: Response, message: string = 'Resource not found') {
        return this.error(res, message, 404);
    }

    static badRequest(res: Response, message: string = 'Bad request') {
        return this.error(res, message, 400);
    }

    static unauthorized(res: Response, message: string = 'Unauthorized') {
        return this.error(res, message, 401);
    }
}
