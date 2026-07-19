"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
class AppError extends Error {
    statusCode;
    isOperational;
    constructor(statusCode, message, isOperational = true, stack = '') {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this.prefixedStackCarrier || this, this.constructor);
        }
    }
    // Helper getter to avoid standard type warnings
    get prefixedStackCarrier() {
        return this;
    }
}
exports.AppError = AppError;
exports.default = AppError;
