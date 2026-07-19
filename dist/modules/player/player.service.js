"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playerService = exports.PlayerService = void 0;
const player_repository_1 = require("./player.repository");
const player_model_1 = require("./player.model");
const AppError_1 = require("../../utils/AppError");
const user_model_1 = require("../user/user.model");
const team_model_1 = require("../team/team.model");
class PlayerService {
    async createPlayer(data, userId) {
        // Verify linked user account exists
        const targetUser = await user_model_1.User.findOne({ _id: data.user, isDeleted: false });
        if (!targetUser) {
            throw new AppError_1.AppError(404, 'Linked user profile not found');
        }
        // Verify user doesn't already have a Player profile
        const existingPlayer = await player_repository_1.playerRepository.findByUserId(data.user.toString());
        if (existingPlayer) {
            throw new AppError_1.AppError(409, 'This user already has a player profile');
        }
        // Set user role to Player if it wasn't already
        if (targetUser.role !== 'Player') {
            targetUser.role = 'Player';
            await targetUser.save({ validateBeforeSave: false });
        }
        // Verify team exists if provided
        if (data.team) {
            const team = await team_model_1.Team.findOne({ _id: data.team, isDeleted: false });
            if (!team) {
                throw new AppError_1.AppError(404, 'Team not found');
            }
        }
        return player_repository_1.playerRepository.create({
            ...data,
            createdBy: userId,
        });
    }
    async getPlayerById(id) {
        const player = await player_repository_1.playerRepository.findById(id);
        if (!player) {
            throw new AppError_1.AppError(404, 'Player profile not found');
        }
        return player;
    }
    async getPlayerByUserId(userId) {
        const player = await player_repository_1.playerRepository.findByUserId(userId);
        if (!player) {
            throw new AppError_1.AppError(404, 'Player profile not found for this user');
        }
        return player;
    }
    async getAllPlayers(query) {
        return player_repository_1.playerRepository.findAll(query);
    }
    async updatePlayer(id, data, userId) {
        const player = await player_repository_1.playerRepository.findById(id);
        if (!player) {
            throw new AppError_1.AppError(404, 'Player profile not found');
        }
        if (data.team) {
            const team = await team_model_1.Team.findOne({ _id: data.team, isDeleted: false });
            if (!team) {
                throw new AppError_1.AppError(404, 'Team not found');
            }
        }
        const updated = await player_repository_1.playerRepository.update(id, {
            ...data,
            updatedBy: userId,
        });
        if (!updated) {
            throw new AppError_1.AppError(400, 'Could not update player profile');
        }
        return updated;
    }
    async deletePlayer(id, userId) {
        const player = await player_repository_1.playerRepository.findById(id);
        if (!player) {
            throw new AppError_1.AppError(404, 'Player profile not found');
        }
        await player_repository_1.playerRepository.softDelete(id, userId);
    }
    async restorePlayer(id, updatedBy) {
        const player = await player_model_1.Player.findOneAndUpdate({ _id: id, isDeleted: true }, { isDeleted: false, updatedBy }, { new: true });
        if (!player) {
            throw new AppError_1.AppError(404, 'Deleted player profile not found');
        }
        return player;
    }
    async bulkDeletePlayers(ids, deletedBy) {
        return player_model_1.Player.updateMany({ _id: { $in: ids }, isDeleted: false }, { isDeleted: true, updatedBy: deletedBy });
    }
    async bulkUpdatePlayers(ids, updateData, updatedBy) {
        return player_model_1.Player.updateMany({ _id: { $in: ids }, isDeleted: false }, { ...updateData, updatedBy });
    }
}
exports.PlayerService = PlayerService;
exports.playerService = new PlayerService();
exports.default = exports.playerService;
