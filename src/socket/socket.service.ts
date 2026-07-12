import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { logger } from '../utils/logger';

export class SocketService {
  private io: Server | null = null;

  init(server: HttpServer): Server {
    this.io = new Server(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    this.io.on('connection', (socket: Socket) => {
      logger.info(`🔌 Realtime client connected: ${socket.id}`);

      // Join individual match live-score rooms
      socket.on('joinMatch', (matchId: string) => {
        socket.join(`match_${matchId}`);
        logger.info(`🔌 Client ${socket.id} joined room: match_${matchId}`);
      });

      socket.on('leaveMatch', (matchId: string) => {
        socket.leave(`match_${matchId}`);
        logger.info(`🔌 Client ${socket.id} left room: match_${matchId}`);
      });

      // Join tournament rooms for overall standings and scores updates
      socket.on('joinTournament', (tournamentId: string) => {
        socket.join(`tournament_${tournamentId}`);
        logger.info(`🔌 Client ${socket.id} joined room: tournament_${tournamentId}`);
      });

      socket.on('leaveTournament', (tournamentId: string) => {
        socket.leave(`tournament_${tournamentId}`);
        logger.info(`🔌 Client ${socket.id} left room: tournament_${tournamentId}`);
      });

      socket.on('disconnect', () => {
        logger.info(`🔌 Client disconnected: ${socket.id}`);
      });
    });

    return this.io;
  }

  emitToMatch(matchId: string, event: string, data: unknown): void {
    if (this.io) {
      this.io.to(`match_${matchId}`).emit(event, data);
      logger.debug(`📡 Broadcasted to room [match_${matchId}]: Event [${event}]`);
    }
  }

  emitToTournament(tournamentId: string, event: string, data: unknown): void {
    if (this.io) {
      this.io.to(`tournament_${tournamentId}`).emit(event, data);
      logger.debug(`📡 Broadcasted to room [tournament_${tournamentId}]: Event [${event}]`);
    }
  }
}

export const socketService = new SocketService();
export default socketService;
