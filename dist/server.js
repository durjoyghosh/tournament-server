"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_1 = require("./app");
const database_1 = require("./config/database");
const socket_service_1 = require("./socket/socket.service");
const env_1 = require("./config/env");
const logger_1 = require("./utils/logger");
// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    logger_1.logger.error('💥 UNCAUGHT EXCEPTION! Shutting down...');
    logger_1.logger.error(err.name, err.message, err.stack || '');
    process.exit(1);
});
let server;
const startServer = async () => {
    // 1) Connect Database
    await (0, database_1.connectDB)();
    // 2) Create HTTP Server
    server = http_1.default.createServer(app_1.app);
    // 3) Connect Realtime WebSockets (Socket.io)
    socket_service_1.socketService.init(server);
    // 4) Start Listening
    const PORT = env_1.env.PORT || 5000;
    server.listen(PORT, () => {
        logger_1.logger.info(`🚀 Server running in ${env_1.env.NODE_ENV} mode on port ${PORT}`);
        logger_1.logger.info(`🩺 Health check URL: http://localhost:${PORT}/health`);
        logger_1.logger.info(`🔌 Realtime Socket server is active`);
    });
};
startServer();
// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
    logger_1.logger.error('💥 UNHANDLED REJECTION! Shutting down gracefully...');
    logger_1.logger.error(err.name, err.message, err.stack || '');
    if (server) {
        server.close(async () => {
            await (0, database_1.disconnectDB)();
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
});
// Handle SIGTERM signals
process.on('SIGTERM', () => {
    logger_1.logger.info('👋 SIGTERM RECEIVED. Shutting down gracefully...');
    if (server) {
        server.close(async () => {
            await (0, database_1.disconnectDB)();
            logger_1.logger.info('💥 Process terminated!');
        });
    }
});
