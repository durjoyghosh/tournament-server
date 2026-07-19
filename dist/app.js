"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const routes_1 = require("./routes");
const error_middleware_1 = require("./middlewares/error.middleware");
const AppError_1 = require("./utils/AppError");
const env_1 = require("./config/env");
const app = (0, express_1.default)();
exports.app = app;
// 1) Global Security Middlewares
app.use((0, helmet_1.default)());
// CORS configuration
app.use((0, cors_1.default)({
    origin: env_1.env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
}));
// 2) Body & Cookie Parsers
app.use(express_1.default.json({ limit: '10kb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10kb' }));
app.use((0, cookie_parser_1.default)());
// 3) Request Logging
if (env_1.env.NODE_ENV !== 'test') {
    app.use((0, morgan_1.default)(env_1.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}
// 4) Health Check Route
app.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Sports Tournament Manager API is healthy',
        timestamp: new Date().toISOString(),
    });
});
// 5) Mount API routes
app.use('/api', routes_1.apiRouter);
// 6) Catch Unhandled Routes
app.all('*', (req, _res, next) => {
    next(new AppError_1.AppError(404, `Can't find ${req.originalUrl} on this server!`));
});
// 7) Centralized Error Handler
app.use(error_middleware_1.globalErrorHandler);
exports.default = app;
