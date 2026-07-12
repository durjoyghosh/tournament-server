import { socketService } from './socket.service';

interface ScorePayload {
  matchId: string;
  score: any;
  status: string;
  events?: any[];
}

// Map to hold pending payloads per match
const pendingUpdates = new Map<string, ScorePayload>();
// Map to hold timers per match for throttling
const timers = new Map<string, NodeJS.Timeout>();

/**
 * Emits a score update for a match, throttled to at most one emission per 500ms.
 * Subsequent calls within the throttle window will merge the payloads and send the latest data.
 */
export function emitScoreUpdate(matchId: string, payload: Omit<ScorePayload, 'matchId'>) {
  const fullPayload: ScorePayload = { matchId, ...payload };
  // Store latest payload
  pendingUpdates.set(matchId, fullPayload);

  // Clear any existing timer for this match
  if (timers.has(matchId)) {
    clearTimeout(timers.get(matchId)!);
  }

  // Set a new timer for 500ms later
  const timer = setTimeout(() => {
    const latest = pendingUpdates.get(matchId);
    if (latest) {
      socketService.emitToMatch(matchId, 'scoreUpdate', latest);
      socketService.emitToTournament(latest.matchId.toString(), 'tournamentScoreUpdate', latest);
      pendingUpdates.delete(matchId);
    }
    timers.delete(matchId);
  }, 500);
  timers.set(matchId, timer);
}
