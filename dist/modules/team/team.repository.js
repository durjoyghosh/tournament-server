"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.teamRepository = exports.TeamRepository = void 0;
const team_model_1 = require("./team.model");
class TeamRepository {
    async findById(id) {
        return team_model_1.Team.findOne({ _id: id, isDeleted: false })
            .populate('manager', 'name email avatar')
            .populate('coach', 'name email avatar');
    }
    async create(data) {
        return team_model_1.Team.create(data);
    }
    async update(id, data) {
        return team_model_1.Team.findOneAndUpdate({ _id: id, isDeleted: false }, data, {
            new: true,
            runValidators: true,
        })
            .populate('manager', 'name email avatar')
            .populate('coach', 'name email avatar');
    }
    async softDelete(id, deletedBy) {
        return team_model_1.Team.findOneAndUpdate({ _id: id, isDeleted: false }, { isDeleted: true, updatedBy: deletedBy }, { new: true });
    }
    async findAll(query) {
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
        if (query.manager) {
            filter.manager = query.manager;
        }
        if (query.coach) {
            filter.coach = query.coach;
        }
        if (query.status) {
            filter.status = query.status;
        }
        const sortField = query.sort || 'createdAt';
        const sortOrder = query.order === 'desc' ? -1 : 1;
        const sortObj = { [sortField]: sortOrder };
        const total = await team_model_1.Team.countDocuments(filter);
        const totalPages = Math.ceil(total / limit);
        const data = await team_model_1.Team.find(filter)
            .populate('manager', 'name email avatar')
            .populate('coach', 'name email avatar')
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
exports.TeamRepository = TeamRepository;
exports.teamRepository = new TeamRepository();
exports.default = exports.teamRepository;
