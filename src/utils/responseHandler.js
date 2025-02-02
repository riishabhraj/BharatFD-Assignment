"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseHandler = void 0;
class ResponseHandler {
    static success(res, data, message = 'Success', statusCode = 200) {
        const response = {
            success: true,
            data,
            message
        };
        res.status(statusCode).json(response);
    }
    static error(res, error, statusCode = 500) {
        const response = {
            success: false,
            error
        };
        res.status(statusCode).json(response);
    }
    static notFound(res, message = 'Resource not found') {
        return this.error(res, message, 404);
    }
    static badRequest(res, message = 'Bad request') {
        return this.error(res, message, 400);
    }
    static unauthorized(res, message = 'Unauthorized') {
        return this.error(res, message, 401);
    }
}
exports.ResponseHandler = ResponseHandler;
