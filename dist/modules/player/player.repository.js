"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playerRepository = exports.PlayerRepository = void 0;
const player_model_1 = require("./player.model");
class PlayerRepository {
    async findById(id) {
        return player_model_1.Player.findOne({ _id: id, isDeleted: false })
            .populate('user', 'name email avatar phoneNumber')
            .populate('team', 'name logo');
    }
    async findByUserId(userId) {
        return player_model_1.Player.findOne({ user: userId, isDeleted: false })
            .populate('user', 'name email avatar phoneNumber')
            .populate('team', 'name logo');
    }
    async create(data) {
        const created = await player_model_1.Player.create(data);
        return created.populate([
            { path: 'user', select: 'name email avatar phoneNumber' },
            { path: 'team', select: 'name logo' }
        ]);
    }
    async update(id, data) {
        return player_model_1.Player.findOneAndUpdate({ _id: id, isDeleted: false }, data, {
            new: true,
            runValidators: true,
        })
            .populate('user', 'name email avatar phoneNumber')
            .populate('team', 'name logo');
    }
    async softDelete(id, deletedBy) {
        return player_model_1.Player.findOneAndUpdate({ _id: id, isDeleted: false }, { isDeleted: true, updatedBy: deletedBy }, { new: true });
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
        if (query.team) {
            filter.team = query.team;
        }
        if (query.status) {
            filter.status = query.status;
        }
        // Dynamic search matches by looking up the populated user name
        let userFilterIds = [];
        if (query.search) {
            // Find matching user IDs
            const mongoose = require('mongoose');
            const User = mongoose.model('User');
            const users = await User.find({
                name: { $regex: query.search, $options: 'i' },
                isDeleted: false,
            }).select('_id');
            userFilterIds = users.map((u) => u._id);
            filter.user = { $in: userFilterIds };
        }
        const sortField = query.sort || 'createdAt';
        const sortOrder = query.order === 'desc' ? -1 : 1;
        const sortObj = { [sortField]: sortOrder };
        const total = await player_model_1.Player.countDocuments(filter);
        const totalPages = Math.ceil(total / limit);
        const data = await player_model_1.Player.find(filter)
            .populate('user', 'name email avatar phoneNumber')
            .populate('team', 'name logo')
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
exports.PlayerRepository = PlayerRepository;
exports.playerRepository = new PlayerRepository();
exports.default = exports.playerRepository;
