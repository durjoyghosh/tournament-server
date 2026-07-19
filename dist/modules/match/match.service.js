"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchService = exports.MatchService = void 0;
const match_repository_1 = require("./match.repository");
const AppError_1 = require("../../utils/AppError");
const tournament_model_1 = require("../tournament/tournament.model");
const team_model_1 = require("../team/team.model");
const user_model_1 = require("../user/user.model");
const socket_service_1 = require("../../socket/socket.service");
class MatchService {
    async createMatch(data, userId) {
        // 1) Verify tournament exists
        const tournament = await tournament_model_1.Tournament.findOne({ _id: data.tournament, isDeleted: false });
        if (!tournament) {
            throw new AppError_1.AppError(404, 'Tournament not found');
        }
        // 2) Verify home and away teams exist and belong to the tournament
        if (data.homeTeam === data.awayTeam) {
            throw new AppError_1.AppError(400, 'Home team and away team must be different');
        }
        const homeTeam = await team_model_1.Team.findOne({ _id: data.homeTeam, isDeleted: false });
        const awayTeam = await team_model_1.Team.findOne({ _id: data.awayTeam, isDeleted: false });
        if (!homeTeam || !awayTeam) {
            throw new AppError_1.AppError(404, 'One or both teams not found');
        }
        // Verify referee if provided
        if (data.referee) {
            const refereeUser = await user_model_1.User.findOne({ _id: data.referee, isDeleted: false });
            if (!refereeUser) {
                throw new AppError_1.AppError(404, 'Referee user not found');
            }
            if (refereeUser.role !== 'Referee' && refereeUser.role !== 'Super Admin') {
                throw new AppError_1.AppError(400, 'Assigned user does not have Referee role privileges');
            }
        }
        return match_repository_1.matchRepository.create({
            ...data,
            createdBy: userId,
        });
    }
    async getMatchById(id) {
        const match = await match_repository_1.matchRepository.findById(id);
        if (!match) {
            throw new AppError_1.AppError(404, 'Match not found');
        }
        return match;
    }
    async getAllMatches(query) {
        return match_repository_1.matchRepository.findAll(query);
    }
    async updateMatch(id, data, userId) {
        const match = await match_repository_1.matchRepository.findById(id);
        if (!match) {
            throw new AppError_1.AppError(404, 'Match not found');
        }
        if (data.referee) {
            const refereeUser = await user_model_1.User.findOne({ _id: data.referee, isDeleted: false });
            if (!refereeUser) {
                throw new AppError_1.AppError(404, 'Referee user not found');
            }
        }
        const updated = await match_repository_1.matchRepository.update(id, {
            ...data,
            updatedBy: userId,
        });
        if (!updated) {
            throw new AppError_1.AppError(400, 'Could not update match');
        }
        return updated;
    }
    async deleteMatch(id, userId) {
        const match = await match_repository_1.matchRepository.findById(id);
        if (!match) {
            throw new AppError_1.AppError(404, 'Match not found');
        }
        await match_repository_1.matchRepository.softDelete(id, userId);
    }
    async restoreMatch(id) {
        const restored = await match_repository_1.matchRepository.restore(id);
        if (!restored) {
            throw new AppError_1.AppError(404, 'Match not found or not deleted');
        }
        return restored;
    }
    async bulkDeleteMatches(ids, userId) {
        await match_repository_1.matchRepository.bulkDelete(ids, userId);
    }
    async updateLiveScore(id, score, newEvent, userId) {
        const match = await match_repository_1.matchRepository.findById(id);
        if (!match) {
            throw new AppError_1.AppError(404, 'Match not found');
        }
        const updateQuery = {
            score,
            status: 'live',
            updatedBy: userId,
        };
        if (newEvent) {
            updateQuery.$push = { events: newEvent };
        }
        const updated = await match_repository_1.matchRepository.update(id, updateQuery);
        if (!updated) {
            throw new AppError_1.AppError(400, 'Could not update live score');
        }
        // Emit Realtime Socket update
        socket_service_1.socketService.emitToMatch(id, 'scoreUpdate', {
            matchId: id,
            score: updated.score,
            status: updated.status,
            events: updated.events,
        });
        socket_service_1.socketService.emitToTournament(updated.tournament.toString(), 'tournamentScoreUpdate', {
            matchId: id,
            score: updated.score,
            status: updated.status,
        });
        return updated;
    }
    async endMatch(id, score, userId) {
        const match = await match_repository_1.matchRepository.findById(id);
        if (!match) {
            throw new AppError_1.AppError(404, 'Match not found');
        }
        const updated = await match_repository_1.matchRepository.update(id, {
            score,
            status: 'completed',
            updatedBy: userId,
            $push: {
                events: {
                    type: 'period_end',
                    minute: 90,
                    details: 'Full Time - Match completed',
                },
            },
        });
        if (!updated) {
            throw new AppError_1.AppError(400, 'Could not end match');
        }
        // Emit socket update
        socket_service_1.socketService.emitToMatch(id, 'matchFinished', {
            matchId: id,
            score: updated.score,
            status: updated.status,
        });
        socket_service_1.socketService.emitToTournament(updated.tournament.toString(), 'tournamentMatchFinished', {
            matchId: id,
            score: updated.score,
            status: updated.status,
        });
        return updated;
    }
    async addMatchEvent(id, event, score, minute, userId) {
        const match = await match_repository_1.matchRepository.findById(id);
        if (!match) {
            throw new AppError_1.AppError(404, 'Match not found');
        }
        const updateQuery = {
            $push: { events: event },
            updatedBy: userId,
        };
        if (score) {
            updateQuery.score = score;
        }
        if (typeof minute === 'number') {
            updateQuery.minute = minute;
        }
        const updated = await match_repository_1.matchRepository.update(id, updateQuery);
        if (!updated) {
            throw new AppError_1.AppError(400, 'Could not add match event');
        }
        socket_service_1.socketService.emitToMatch(id, 'eventAdded', {
            matchId: id,
            event,
            score: updated.score,
            minute: updated.minute,
        });
        return updated;
    }
    async updateRefereeStatus(id, refereeId, status, reason) {
        const match = await match_repository_1.matchRepository.findById(id);
        if (!match) {
            throw new AppError_1.AppError(404, 'Match not found');
        }
        const matchRefereeId = typeof match.referee === 'object' && match.referee ? match.referee._id.toString() : match.referee?.toString();
        if (matchRefereeId !== refereeId) {
            throw new AppError_1.AppError(403, 'You are not assigned as the referee for this match');
        }
        const details = reason ? `Status changed to ${status}. Reason: ${reason}` : `Status changed to ${status}`;
        const updated = await match_repository_1.matchRepository.update(id, {
            refereeStatus: status,
            $push: {
                events: {
                    type: 'custom',
                    minute: 0,
                    details: `Referee Assignment: ${details}`,
                },
            },
        });
        if (!updated) {
            throw new AppError_1.AppError(400, 'Could not update referee status');
        }
        return updated;
    }
    async startMatch(id, userId) {
        const match = await match_repository_1.matchRepository.findById(id);
        if (!match) {
            throw new AppError_1.AppError(404, 'Match not found');
        }
        const updated = await match_repository_1.matchRepository.update(id, {
            status: 'live',
            minute: 0,
            updatedBy: userId,
            $push: {
                events: {
                    type: 'period_start',
                    minute: 0,
                    details: 'Match started',
                },
            },
        });
        if (!updated) {
            throw new AppError_1.AppError(400, 'Could not start match');
        }
        socket_service_1.socketService.emitToMatch(id, 'matchStarted', {
            matchId: id,
            status: 'live',
        });
        return updated;
    }
    async halftimeMatch(id, userId) {
        const match = await match_repository_1.matchRepository.findById(id);
        if (!match) {
            throw new AppError_1.AppError(404, 'Match not found');
        }
        const updated = await match_repository_1.matchRepository.update(id, {
            status: 'halftime',
            updatedBy: userId,
            $push: {
                events: {
                    type: 'period_end',
                    minute: match.minute || 45,
                    details: 'Half-time whistle blown',
                },
            },
        });
        if (!updated) {
            throw new AppError_1.AppError(400, 'Could not pause match for halftime');
        }
        socket_service_1.socketService.emitToMatch(id, 'matchHalftime', {
            matchId: id,
            status: 'halftime',
        });
        return updated;
    }
    async submitRefereeReport(id, report, userId) {
        const match = await match_repository_1.matchRepository.findById(id);
        if (!match) {
            throw new AppError_1.AppError(404, 'Match not found');
        }
        const updated = await match_repository_1.matchRepository.update(id, {
            refereeReport: report,
            updatedBy: userId,
        });
        if (!updated) {
            throw new AppError_1.AppError(400, 'Could not submit referee report');
        }
        return updated;
    }
    async updateLineup(id, side, starting, substitutes, userId) {
        const match = await match_repository_1.matchRepository.findById(id);
        if (!match) {
            throw new AppError_1.AppError(404, 'Match not found');
        }
        const lineupKey = `lineups.${side}`;
        const updated = await match_repository_1.matchRepository.update(id, {
            [lineupKey]: { starting, substitutes },
            updatedBy: userId,
        });
        if (!updated) {
            throw new AppError_1.AppError(400, 'Could not update lineup');
        }
        return updated;
    }
    async getMyAssignedMatches(refereeId, query) {
        return match_repository_1.matchRepository.findAll({ ...query, referee: refereeId });
    }
    async getMyScorekeeperMatches(scorekeeperId, query) {
        return match_repository_1.matchRepository.findAll({ ...query, scorekeeper: scorekeeperId });
    }
}
exports.MatchService = MatchService;
exports.matchService = new MatchService();
exports.default = exports.matchService;
