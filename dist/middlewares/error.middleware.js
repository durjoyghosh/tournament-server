"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = require("../utils/AppError");
const env_1 = require("../config/env");
const globalErrorHandler = (err, _req, res, _next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Something went wrong';
    let errors = [];
    // Handlers for specific errors
    if (err instanceof AppError_1.AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    else if (err instanceof zod_1.ZodError) {
        statusCode = 400;
        message = 'Validation failed';
        errors = err.issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message,
        }));
    }
    else if (err instanceof mongoose_1.default.Error.ValidationError) {
        statusCode = 400;
        message = 'Validation failed';
        errors = Object.values(err.errors).map((el) => ({
            path: el.path,
            message: el.message,
        }));
    }
    else if (err.code === 11000) {
        statusCode = 409;
        const key = Object.keys(err.keyValue || {})[0] || 'field';
        message = `Duplicate field value entered: ${key}. Please use another value!`;
        errors = [
            {
                path: key,
                message: `${key} already exists`,
            },
        ];
    }
    else if (err instanceof mongoose_1.default.Error.CastError) {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}`;
        errors = [
            {
                path: err.path,
                message: `Invalid value: ${err.value}`,
            },
        ];
    }
    else if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token. Please log in again!';
    }
    else if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Your token has expired. Please log in again!';
    }
    // Debug or development logging
    if (env_1.env.NODE_ENV === 'development') {
        console.error('💥 Error object:', err);
    }
    res.status(statusCode).json({
        success: false,
        message,
        ...(errors.length > 0 ? { errors } : {}),
        ...(env_1.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
    });
};
exports.globalErrorHandler = globalErrorHandler;
exports.default = exports.globalErrorHandler;
