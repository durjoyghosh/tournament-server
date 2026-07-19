"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tournamentService = exports.TournamentService = void 0;
const tournament_repository_1 = require("./tournament.repository");
const tournament_model_1 = require("./tournament.model");
const AppError_1 = require("../../utils/AppError");
const team_model_1 = require("../team/team.model");
const match_model_1 = require("../match/match.model");
class TournamentService {
    async createSport(data, userId) {
        return tournament_repository_1.tournamentRepository.createSport({
            ...data,
            createdBy: userId,
        });
    }
    async getAllSports(query) {
        return tournament_repository_1.tournamentRepository.findAllSports(query);
    }
    async updateSport(id, data, userId) {
        const updated = await tournament_repository_1.tournamentRepository.updateSport(id, { ...data, updatedBy: userId });
        if (!updated)
            throw new AppError_1.AppError(404, 'Sport not found');
        return updated;
    }
    async createTournament(data, userId) {
        if (data.sport) {
            const sport = await tournament_repository_1.tournamentRepository.findSportById(data.sport.toString());
            if (!sport) {
                throw new AppError_1.AppError(404, 'Sport not found');
            }
        }
        return tournament_repository_1.tournamentRepository.createTournament({
            ...data,
            organizer: data.organizer || userId,
            createdBy: userId,
        });
    }
    async getTournamentById(id) {
        const tournament = await tournament_repository_1.tournamentRepository.findTournamentById(id);
        if (!tournament) {
            throw new AppError_1.AppError(404, 'Tournament not found');
        }
        return tournament;
    }
    async getAllTournaments(query) {
        return tournament_repository_1.tournamentRepository.findAllTournaments(query);
    }
    async getMyTournaments(organizerId, query) {
        return tournament_repository_1.tournamentRepository.findAllTournaments({
            ...query,
            organizer: organizerId,
        });
    }
    async updateTournament(id, data, userId) {
        const tournament = await tournament_repository_1.tournamentRepository.findTournamentById(id);
        if (!tournament) {
            throw new AppError_1.AppError(404, 'Tournament not found');
        }
        if (data.sport) {
            const sport = await tournament_repository_1.tournamentRepository.findSportById(data.sport.toString());
            if (!sport) {
                throw new AppError_1.AppError(404, 'Sport not found');
            }
        }
        const updatedTournament = await tournament_repository_1.tournamentRepository.updateTournament(id, {
            ...data,
            updatedBy: userId,
        });
        if (!updatedTournament) {
            throw new AppError_1.AppError(400, 'Could not update tournament');
        }
        return updatedTournament;
    }
    async deleteTournament(id, userId) {
        const tournament = await tournament_repository_1.tournamentRepository.findTournamentById(id);
        if (!tournament) {
            throw new AppError_1.AppError(404, 'Tournament not found');
        }
        await tournament_repository_1.tournamentRepository.softDeleteTournament(id, userId);
    }
    async publishTournament(id, userId) {
        const tournament = await tournament_repository_1.tournamentRepository.findTournamentById(id);
        if (!tournament)
            throw new AppError_1.AppError(404, 'Tournament not found');
        const updated = await tournament_repository_1.tournamentRepository.updateTournament(id, {
            isPublished: true,
            updatedBy: userId,
        });
        if (!updated)
            throw new AppError_1.AppError(400, 'Could not publish tournament');
        return updated;
    }
    async archiveTournament(id, userId) {
        const tournament = await tournament_repository_1.tournamentRepository.findTournamentById(id);
        if (!tournament)
            throw new AppError_1.AppError(404, 'Tournament not found');
        const updated = await tournament_repository_1.tournamentRepository.updateTournament(id, {
            status: 'completed',
            isPublished: false,
            updatedBy: userId,
        });
        if (!updated)
            throw new AppError_1.AppError(400, 'Could not archive tournament');
        return updated;
    }
    // Team Manager applies to join tournament
    async applyTeam(id, teamId, userId) {
        const tournament = await tournament_repository_1.tournamentRepository.findTournamentById(id);
        if (!tournament)
            throw new AppError_1.AppError(404, 'Tournament not found');
        if (!tournament.isPublished)
            throw new AppError_1.AppError(400, 'Tournament is not open for registration');
        const team = await team_model_1.Team.findOne({ _id: teamId, isDeleted: false });
        if (!team)
            throw new AppError_1.AppError(404, 'Team not found');
        const isAlreadyRegistered = tournament.teams.some(t => t.toString() === teamId);
        const isAlreadyPending = tournament.pendingTeams.some(t => t.toString() === teamId);
        if (isAlreadyRegistered || isAlreadyPending) {
            throw new AppError_1.AppError(400, 'Team has already applied or is registered');
        }
        const updated = await tournament_repository_1.tournamentRepository.addPendingTeam(id, teamId, userId);
        if (!updated)
            throw new AppError_1.AppError(400, 'Could not submit team application');
        return updated;
    }
    // Organizer approves a pending team
    async approveTeam(id, teamId, userId) {
        const tournament = await tournament_repository_1.tournamentRepository.findTournamentById(id);
        if (!tournament)
            throw new AppError_1.AppError(404, 'Tournament not found');
        const isPending = tournament.pendingTeams.some(t => t.toString() === teamId);
        if (!isPending)
            throw new AppError_1.AppError(400, 'Team is not in the pending list');
        if (tournament.teams.length >= tournament.maxTeams) {
            throw new AppError_1.AppError(400, `Tournament is full (max ${tournament.maxTeams} teams)`);
        }
        const updated = await tournament_repository_1.tournamentRepository.movePendingToApproved(id, teamId, userId);
        if (!updated)
            throw new AppError_1.AppError(400, 'Could not approve team');
        return updated;
    }
    // Organizer rejects a pending team
    async rejectTeam(id, teamId, userId) {
        const tournament = await tournament_repository_1.tournamentRepository.findTournamentById(id);
        if (!tournament)
            throw new AppError_1.AppError(404, 'Tournament not found');
        const updated = await tournament_repository_1.tournamentRepository.movePendingToRejected(id, teamId, userId);
        if (!updated)
            throw new AppError_1.AppError(400, 'Could not reject team');
        return updated;
    }
    async registerTeam(id, teamId, userId) {
        const tournament = await tournament_repository_1.tournamentRepository.findTournamentById(id);
        if (!tournament)
            throw new AppError_1.AppError(404, 'Tournament not found');
        const team = await team_model_1.Team.findOne({ _id: teamId, isDeleted: false });
        if (!team)
            throw new AppError_1.AppError(404, 'Team not found');
        const updated = await tournament_repository_1.tournamentRepository.registerTeam(id, teamId, userId);
        if (!updated)
            throw new AppError_1.AppError(400, 'Team is already registered in this tournament');
        return updated;
    }
    async unregisterTeam(id, teamId, userId) {
        const tournament = await tournament_repository_1.tournamentRepository.findTournamentById(id);
        if (!tournament)
            throw new AppError_1.AppError(404, 'Tournament not found');
        const updated = await tournament_repository_1.tournamentRepository.unregisterTeam(id, teamId, userId);
        if (!updated)
            throw new AppError_1.AppError(400, 'Team is not registered in this tournament');
        return updated;
    }
    // Berger Round-Robin Fixture Generator
    async generateFixtures(id, options, userId) {
        const tournament = await tournament_repository_1.tournamentRepository.findTournamentById(id);
        if (!tournament)
            throw new AppError_1.AppError(404, 'Tournament not found');
        if (tournament.teams.length < 2)
            throw new AppError_1.AppError(400, 'Need at least 2 teams to generate fixtures');
        const teams = [...tournament.teams.map(t => t.toString())];
        const venue = options.venue || '';
        const intervalDays = options.matchIntervalDays || 3;
        let currentDate = new Date(options.startDate);
        const fixtures = [];
        if (tournament.format === 'knockout') {
            // Single-elimination: pair teams randomly
            const shuffled = teams.sort(() => Math.random() - 0.5);
            for (let i = 0; i < shuffled.length - 1; i += 2) {
                fixtures.push({
                    tournament: id,
                    homeTeam: shuffled[i],
                    awayTeam: shuffled[i + 1],
                    venue,
                    date: new Date(currentDate),
                    round: 'Round of ' + shuffled.length,
                    status: 'scheduled',
                    createdBy: userId,
                });
                currentDate = new Date(currentDate.getTime() + intervalDays * 86400000);
            }
        }
        else {
            // Round-robin (league/hybrid): every team plays each other once
            // Berger algorithm for even number of teams
            const n = teams.length % 2 === 0 ? teams.length : teams.length + 1;
            const rounds = n - 1;
            const half = n / 2;
            // Pad with null (bye) if odd number
            const t = [...teams];
            if (t.length % 2 !== 0)
                t.push('bye');
            for (let round = 0; round < rounds; round++) {
                for (let i = 0; i < half; i++) {
                    const home = t[i];
                    const away = t[n - 1 - i];
                    if (home !== 'bye' && away !== 'bye') {
                        fixtures.push({
                            tournament: id,
                            homeTeam: home,
                            awayTeam: away,
                            venue,
                            date: new Date(currentDate),
                            round: `Round ${round + 1}`,
                            status: 'scheduled',
                            createdBy: userId,
                        });
                    }
                }
                currentDate = new Date(currentDate.getTime() + intervalDays * 86400000);
                // Rotate teams (keep first fixed)
                const last = t.pop();
                t.splice(1, 0, last);
            }
        }
        // Save all fixtures to the database
        const created = await match_model_1.Match.insertMany(fixtures);
        return created;
    }
    async addAnnouncement(id, data, userId) {
        const tournament = await tournament_repository_1.tournamentRepository.findTournamentById(id);
        if (!tournament)
            throw new AppError_1.AppError(404, 'Tournament not found');
        const updated = await tournament_repository_1.tournamentRepository.pushAnnouncement(id, data, userId);
        if (!updated)
            throw new AppError_1.AppError(400, 'Could not add announcement');
        return updated;
    }
    async addSponsor(id, data, userId) {
        const tournament = await tournament_repository_1.tournamentRepository.findTournamentById(id);
        if (!tournament)
            throw new AppError_1.AppError(404, 'Tournament not found');
        const updated = await tournament_repository_1.tournamentRepository.pushSponsor(id, data, userId);
        if (!updated)
            throw new AppError_1.AppError(400, 'Could not add sponsor');
        return updated;
    }
    async addGalleryItem(id, imageUrl, userId) {
        const tournament = await tournament_repository_1.tournamentRepository.findTournamentById(id);
        if (!tournament)
            throw new AppError_1.AppError(404, 'Tournament not found');
        const updated = await tournament_repository_1.tournamentRepository.pushGalleryItem(id, imageUrl, userId);
        if (!updated)
            throw new AppError_1.AppError(400, 'Could not add gallery item');
        return updated;
    }
    async restoreTournament(id, updatedBy) {
        const tournament = await tournament_model_1.Tournament.findOneAndUpdate({ _id: id, isDeleted: true }, { isDeleted: false, updatedBy }, { new: true });
        if (!tournament) {
            throw new AppError_1.AppError(404, 'Deleted tournament not found');
        }
        return tournament;
    }
    async bulkDeleteTournaments(ids, deletedBy) {
        return tournament_model_1.Tournament.updateMany({ _id: { $in: ids }, isDeleted: false }, { isDeleted: true, updatedBy: deletedBy });
    }
    async bulkUpdateTournaments(ids, updateData, updatedBy) {
        return tournament_model_1.Tournament.updateMany({ _id: { $in: ids }, isDeleted: false }, { ...updateData, updatedBy });
    }
}
exports.TournamentService = TournamentService;
exports.tournamentService = new TournamentService();
exports.default = exports.tournamentService;
