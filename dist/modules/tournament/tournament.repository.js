"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tournamentRepository = exports.TournamentRepository = void 0;
const tournament_model_1 = require("./tournament.model");
const sport_model_1 = require("./sport.model");
class TournamentRepository {
    // --- Sport CRUD Operations ---
    async createSport(data) {
        return sport_model_1.Sport.create(data);
    }
    async findSportById(id) {
        return sport_model_1.Sport.findOne({ _id: id, isDeleted: false });
    }
    async findAllSports(query) {
        const filter = { isDeleted: false, status: 'active' };
        if (query.search) {
            filter.name = { $regex: query.search, $options: 'i' };
        }
        return sport_model_1.Sport.find(filter);
    }
    async updateSport(id, data) {
        return sport_model_1.Sport.findOneAndUpdate({ _id: id, isDeleted: false }, data, { new: true });
    }
    // --- Tournament CRUD Operations ---
    async createTournament(data) {
        return tournament_model_1.Tournament.create(data);
    }
    async findTournamentById(id) {
        return tournament_model_1.Tournament.findOne({ _id: id, isDeleted: false })
            .populate('sport')
            .populate('organizer', 'name email avatar')
            .populate('teams')
            .populate('pendingTeams', 'name logo manager')
            .populate('rejectedTeams', 'name logo');
    }
    async updateTournament(id, data) {
        return tournament_model_1.Tournament.findOneAndUpdate({ _id: id, isDeleted: false }, data, { new: true })
            .populate('sport')
            .populate('organizer', 'name email avatar')
            .populate('teams');
    }
    async softDeleteTournament(id, deletedBy) {
        return tournament_model_1.Tournament.findOneAndUpdate({ _id: id, isDeleted: false }, { isDeleted: true, updatedBy: deletedBy }, { new: true });
    }
    async registerTeam(id, teamId, updatedBy) {
        return tournament_model_1.Tournament.findOneAndUpdate({ _id: id, isDeleted: false, teams: { $ne: teamId } }, { $push: { teams: teamId }, updatedBy }, { new: true });
    }
    async unregisterTeam(id, teamId, updatedBy) {
        return tournament_model_1.Tournament.findOneAndUpdate({ _id: id, isDeleted: false }, { $pull: { teams: teamId }, updatedBy }, { new: true });
    }
    // Team Manager applies - goes to pendingTeams
    async addPendingTeam(id, teamId, updatedBy) {
        return tournament_model_1.Tournament.findOneAndUpdate({ _id: id, isDeleted: false, pendingTeams: { $ne: teamId }, teams: { $ne: teamId } }, { $push: { pendingTeams: teamId }, updatedBy }, { new: true });
    }
    // Organizer approves: move from pendingTeams → teams
    async movePendingToApproved(id, teamId, updatedBy) {
        return tournament_model_1.Tournament.findOneAndUpdate({ _id: id, isDeleted: false }, {
            $pull: { pendingTeams: teamId },
            $push: { teams: teamId },
            updatedBy,
        }, { new: true });
    }
    // Organizer rejects: move from pendingTeams → rejectedTeams
    async movePendingToRejected(id, teamId, updatedBy) {
        return tournament_model_1.Tournament.findOneAndUpdate({ _id: id, isDeleted: false }, {
            $pull: { pendingTeams: teamId },
            $push: { rejectedTeams: teamId },
            updatedBy,
        }, { new: true });
    }
    async pushAnnouncement(id, data, updatedBy) {
        return tournament_model_1.Tournament.findOneAndUpdate({ _id: id, isDeleted: false }, { $push: { announcements: { ...data, date: new Date() } }, updatedBy }, { new: true });
    }
    async pushSponsor(id, data, updatedBy) {
        return tournament_model_1.Tournament.findOneAndUpdate({ _id: id, isDeleted: false }, { $push: { sponsors: data }, updatedBy }, { new: true });
    }
    async pushGalleryItem(id, imageUrl, updatedBy) {
        return tournament_model_1.Tournament.findOneAndUpdate({ _id: id, isDeleted: false }, { $push: { gallery: imageUrl }, updatedBy }, { new: true });
    }
    async findAllTournaments(query) {
        const page = Math.max(1, query.page || 1);
        const limit = Math.max(1, query.limit || 10);
        const skip = (page - 1) * limit;
        const filter = {};
        if (query.showDeleted === 'true') {
            filter.isDeleted = true;
        }
        else {
            filter.isDeleted = false;
        }
        if (query.search) {
            filter.name = { $regex: query.search, $options: 'i' };
        }
        if (query.sport) {
            filter.sport = query.sport;
        }
        if (query.status) {
            filter.status = query.status;
        }
        if (query.organizer) {
            filter.organizer = query.organizer;
        }
        if (query.isPublished !== undefined) {
            filter.isPublished = query.isPublished === 'true';
        }
        const sortField = query.sort || 'createdAt';
        const sortOrder = query.order === 'desc' ? -1 : 1;
        const sortObj = { [sortField]: sortOrder };
        const total = await tournament_model_1.Tournament.countDocuments(filter);
        const totalPages = Math.ceil(total / limit);
        const data = await tournament_model_1.Tournament.find(filter)
            .populate('sport')
            .populate('organizer', 'name email avatar')
            .sort(sortObj)
            .skip(skip)
            .limit(limit);
        return {
            data,
            meta: {
                page,
                limit,
                total,
                totalPages,
            },
        };
    }
}
exports.TournamentRepository = TournamentRepository;
exports.tournamentRepository = new TournamentRepository();
