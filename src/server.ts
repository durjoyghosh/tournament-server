import http from 'http';
import { app } from './app';
import { connectDB, disconnectDB } from './config/database';
import { socketService } from './socket/socket.service';
import { env } from './config/env';
import { logger } from './utils/logger';

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('💥 UNCAUGHT EXCEPTION! Shutting down...');
  logger.error(err.name, err.message, err.stack || '');
  process.exit(1);
});

let server: http.Server;

const startServer = async () => {
  // 1) Connect Database
  await connectDB();

  // 2) Create HTTP Server
  server = http.createServer(app);

  // 3) Connect Realtime WebSockets (Socket.io)
  socketService.init(server);

  // 4) Start Listening
  const PORT = env.PORT || 5000;
  server.listen(PORT, () => {
    logger.info(`🚀 Server running in ${env.NODE_ENV} mode on port ${PORT}`);
    logger.info(`🩺 Health check URL: http://localhost:${PORT}/health`);
    logger.info(`🔌 Realtime Socket server is active`);
  });
};

startServer();

// Handle unhandled rejections
process.on('unhandledRejection', (err: Error) => {
  logger.error('💥 UNHANDLED REJECTION! Shutting down gracefully...');
  logger.error(err.name, err.message, err.stack || '');
  if (server) {
    server.close(async () => {
      await disconnectDB();
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Handle SIGTERM signals
process.on('SIGTERM', () => {
  logger.info('👋 SIGTERM RECEIVED. Shutting down gracefully...');
  if (server) {
    server.close(async () => {
      await disconnectDB();
      logger.info('💥 Process terminated!');
    });
  }
});
