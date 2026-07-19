"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchRepository = exports.MatchRepository = void 0;
const match_model_1 = require("./match.model");
class MatchRepository {
    async findById(id) {
        return match_model_1.Match.findOne({ _id: id, isDeleted: false })
            .populate('tournament', 'name season format')
            .populate('homeTeam', 'name logo')
            .populate('awayTeam', 'name logo')
            .populate('referee', 'name email avatar')
            .populate('events.player', 'jerseyNumber position');
    }
    async create(data) {
        const created = await match_model_1.Match.create(data);
        return created.populate([
            { path: 'tournament', select: 'name season format' },
            { path: 'homeTeam', select: 'name logo' },
            { path: 'awayTeam', select: 'name logo' },
            { path: 'referee', select: 'name email avatar' },
        ]);
    }
    async update(id, data) {
        return match_model_1.Match.findOneAndUpdate({ _id: id, isDeleted: false }, data, {
            new: true,
            runValidators: true,
        })
            .populate('tournament', 'name season format')
            .populate('homeTeam', 'name logo')
            .populate('awayTeam', 'name logo')
            .populate('referee', 'name email avatar')
            .populate('events.player', 'jerseyNumber position');
    }
    async softDelete(id, deletedBy) {
        return match_model_1.Match.findOneAndUpdate({ _id: id, isDeleted: false }, { isDeleted: true, updatedBy: deletedBy }, { new: true });
    }
    async findAll(query) {
        const page = Math.max(1, query.page || 1);
        const limit = Math.max(1, query.limit || 10);
        const skip = (page - 1) * limit;
        const filter = query.showDeleted === 'true'
            ? { isDeleted: true }
            : { isDeleted: false };
        if (query.tournament) {
            filter.tournament = query.tournament;
        }
        if (query.team) {
            filter.$or = [{ homeTeam: query.team }, { awayTeam: query.team }];
        }
        if (query.referee) {
            filter.referee = query.referee;
        }
        if (query.status) {
            filter.status = query.status;
        }
        const sortField = query.sort || 'date';
        const sortOrder = query.order === 'desc' ? -1 : 1;
        const sortObj = { [sortField]: sortOrder };
        const total = await match_model_1.Match.countDocuments(filter);
        const totalPages = Math.ceil(total / limit);
        const data = await match_model_1.Match.find(filter)
            .populate('tournament', 'name season format')
            .populate('homeTeam', 'name logo')
            .populate('awayTeam', 'name logo')
            .populate('referee', 'name email avatar')
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
    async restore(id) {
        return match_model_1.Match.findOneAndUpdate({ _id: id, isDeleted: true }, { isDeleted: false }, { new: true });
    }
    async bulkDelete(ids, deletedBy) {
        await match_model_1.Match.updateMany({ _id: { $in: ids }, isDeleted: false }, { isDeleted: true, updatedBy: deletedBy });
    }
}
exports.MatchRepository = MatchRepository;
exports.matchRepository = new MatchRepository();
exports.default = exports.matchRepository;
