"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketService = exports.SocketService = void 0;
const socket_io_1 = require("socket.io");
const logger_1 = require("../utils/logger");
class SocketService {
    io = null;
    init(server) {
        this.io = new socket_io_1.Server(server, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST'],
            },
        });
        this.io.on('connection', (socket) => {
            logger_1.logger.info(`🔌 Realtime client connected: ${socket.id}`);
            // Join individual match live-score rooms
            socket.on('joinMatch', (matchId) => {
                socket.join(`match_${matchId}`);
                logger_1.logger.info(`🔌 Client ${socket.id} joined room: match_${matchId}`);
            });
            socket.on('leaveMatch', (matchId) => {
                socket.leave(`match_${matchId}`);
                logger_1.logger.info(`🔌 Client ${socket.id} left room: match_${matchId}`);
            });
            // Join tournament rooms for overall standings and scores updates
            socket.on('joinTournament', (tournamentId) => {
                socket.join(`tournament_${tournamentId}`);
                logger_1.logger.info(`🔌 Client ${socket.id} joined room: tournament_${tournamentId}`);
            });
            socket.on('leaveTournament', (tournamentId) => {
                socket.leave(`tournament_${tournamentId}`);
                logger_1.logger.info(`🔌 Client ${socket.id} left room: tournament_${tournamentId}`);
            });
            socket.on('disconnect', () => {
                logger_1.logger.info(`🔌 Client disconnected: ${socket.id}`);
            });
        });
        return this.io;
    }
    emitToMatch(matchId, event, data) {
        if (this.io) {
            this.io.to(`match_${matchId}`).emit(event, data);
            logger_1.logger.debug(`📡 Broadcasted to room [match_${matchId}]: Event [${event}]`);
        }
    }
    emitToTournament(tournamentId, event, data) {
        if (this.io) {
            this.io.to(`tournament_${tournamentId}`).emit(event, data);
            logger_1.logger.debug(`📡 Broadcasted to room [tournament_${tournamentId}]: Event [${event}]`);
        }
    }
}
exports.SocketService = SocketService;
exports.socketService = new SocketService();
exports.default = exports.socketService;
