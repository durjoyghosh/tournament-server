"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitScoreUpdate = emitScoreUpdate;
const socket_service_1 = require("./socket.service");
// Map to hold pending payloads per match
const pendingUpdates = new Map();
// Map to hold timers per match for throttling
const timers = new Map();
/**
 * Emits a score update for a match, throttled to at most one emission per 500ms.
 * Subsequent calls within the throttle window will merge the payloads and send the latest data.
 */
function emitScoreUpdate(matchId, payload) {
    const fullPayload = { matchId, ...payload };
    // Store latest payload
    pendingUpdates.set(matchId, fullPayload);
    // Clear any existing timer for this match
    if (timers.has(matchId)) {
        clearTimeout(timers.get(matchId));
    }
    // Set a new timer for 500ms later
    const timer = setTimeout(() => {
        const latest = pendingUpdates.get(matchId);
        if (latest) {
            socket_service_1.socketService.emitToMatch(matchId, 'scoreUpdate', latest);
            socket_service_1.socketService.emitToTournament(latest.matchId.toString(), 'tournamentScoreUpdate', latest);
            pendingUpdates.delete(matchId);
        }
        timers.delete(matchId);
    }, 500);
    timers.set(matchId, timer);
}
