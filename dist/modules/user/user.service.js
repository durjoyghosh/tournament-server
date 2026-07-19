"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = exports.UserService = void 0;
const user_repository_1 = require("./user.repository");
const AppError_1 = require("../../utils/AppError");
const user_model_1 = require("./user.model");
const tournament_model_1 = require("../tournament/tournament.model");
const team_model_1 = require("../team/team.model");
const player_model_1 = require("../player/player.model");
const match_model_1 = require("../match/match.model");
class UserService {
    async createUser(userData, createdBy) {
        const existingUser = await user_repository_1.userRepository.findByEmail(userData.email || '');
        if (existingUser) {
            throw new AppError_1.AppError(409, 'Email is already registered');
        }
        // Organizers start as pending until Super Admin approves
        const finalData = { ...userData, createdBy };
        if (userData.role === 'Organizer') {
            finalData.organizerStatus = 'pending';
        }
        return user_repository_1.userRepository.create(finalData);
    }
    async getUserById(id) {
        const user = await user_repository_1.userRepository.findById(id);
        if (!user) {
            throw new AppError_1.AppError(404, 'User not found');
        }
        return user;
    }
    async getAllUsers(query) {
        return user_repository_1.userRepository.findAll(query);
    }
    async updateUser(id, updateData, updatedBy) {
        const user = await user_repository_1.userRepository.findById(id);
        if (!user) {
            throw new AppError_1.AppError(404, 'User not found');
        }
        if (updateData.email) {
            const emailUser = await user_repository_1.userRepository.findByEmail(updateData.email);
            if (emailUser && emailUser.id !== id) {
                throw new AppError_1.AppError(409, 'Email is already in use by another user');
            }
        }
        const updatedUser = await user_repository_1.userRepository.update(id, {
            ...updateData,
            updatedBy,
        });
        if (!updatedUser) {
            throw new AppError_1.AppError(400, 'Could not update user');
        }
        return updatedUser;
    }
    async deleteUser(id, deletedBy) {
        const user = await user_repository_1.userRepository.findById(id);
        if (!user) {
            throw new AppError_1.AppError(404, 'User not found');
        }
        await user_repository_1.userRepository.softDelete(id, deletedBy);
    }
    async updateUserStatus(id, status, suspendReason, updatedBy) {
        const user = await user_repository_1.userRepository.findById(id);
        if (!user) {
            throw new AppError_1.AppError(404, 'User not found');
        }
        const updatedUser = await user_repository_1.userRepository.update(id, {
            status,
            suspendReason: suspendReason || '',
            updatedBy,
        });
        if (!updatedUser) {
            throw new AppError_1.AppError(400, 'Could not update user status');
        }
        return updatedUser;
    }
    async getPendingOrganizers() {
        return user_model_1.User.find({ role: 'Organizer', organizerStatus: 'pending', isDeleted: false });
    }
    async approveOrganizer(id, updatedBy) {
        const user = await user_repository_1.userRepository.findById(id);
        if (!user) {
            throw new AppError_1.AppError(404, 'User not found');
        }
        if (user.role !== 'Organizer') {
            throw new AppError_1.AppError(400, 'User is not an organizer');
        }
        const updatedUser = await user_repository_1.userRepository.update(id, {
            organizerStatus: 'approved',
            status: 'active',
            updatedBy,
        });
        if (!updatedUser) {
            throw new AppError_1.AppError(400, 'Could not approve organizer');
        }
        return updatedUser;
    }
    async rejectOrganizer(id, updatedBy, reason) {
        const user = await user_repository_1.userRepository.findById(id);
        if (!user) {
            throw new AppError_1.AppError(404, 'User not found');
        }
        if (user.role !== 'Organizer') {
            throw new AppError_1.AppError(400, 'User is not an organizer');
        }
        const updatedUser = await user_repository_1.userRepository.update(id, {
            organizerStatus: 'rejected',
            suspendReason: reason || 'Application rejected by Super Admin',
            updatedBy,
        });
        if (!updatedUser) {
            throw new AppError_1.AppError(400, 'Could not reject organizer');
        }
        return updatedUser;
    }
    async getPlatformAnalytics() {
        const [totalUsers, totalOrganizers, pendingOrganizers, totalTournaments, liveTournaments, totalTeams, totalPlayers, totalMatches, liveMatches, completedMatches, usersByRole,] = await Promise.all([
            user_model_1.User.countDocuments({ isDeleted: false }),
            user_model_1.User.countDocuments({ role: 'Organizer', isDeleted: false }),
            user_model_1.User.countDocuments({ role: 'Organizer', organizerStatus: 'pending', isDeleted: false }),
            tournament_model_1.Tournament.countDocuments({ isDeleted: false }),
            tournament_model_1.Tournament.countDocuments({ status: 'live', isDeleted: false }),
            team_model_1.Team.countDocuments({ isDeleted: false }),
            player_model_1.Player.countDocuments({ isDeleted: false }),
            match_model_1.Match.countDocuments({ isDeleted: false }),
            match_model_1.Match.countDocuments({ status: 'live', isDeleted: false }),
            match_model_1.Match.countDocuments({ status: 'completed', isDeleted: false }),
            user_model_1.User.aggregate([
                { $match: { isDeleted: false } },
                { $group: { _id: '$role', count: { $sum: 1 } } },
            ]),
        ]);
        return {
            users: {
                total: totalUsers,
                organizers: totalOrganizers,
                pendingOrganizers,
                byRole: usersByRole,
            },
            tournaments: {
                total: totalTournaments,
                live: liveTournaments,
            },
            teams: { total: totalTeams },
            players: { total: totalPlayers },
            matches: {
                total: totalMatches,
                live: liveMatches,
                completed: completedMatches,
            },
        };
    }
    async getActivityLogs(query) {
        const page = Math.max(1, Number(query.page) || 1);
        const limit = Math.max(1, Number(query.limit) || 20);
        const skip = (page - 1) * limit;
        // Return recently updated users as a proxy for activity logs
        const total = await user_model_1.User.countDocuments({ isDeleted: false });
        const data = await user_model_1.User.find({ isDeleted: false })
            .select('name email role status organizerStatus updatedAt createdAt')
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(limit);
        return {
            data,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async restoreUser(id, updatedBy) {
        const user = await user_model_1.User.findOneAndUpdate({ _id: id, isDeleted: true }, { isDeleted: false, updatedBy }, { new: true });
        if (!user) {
            throw new AppError_1.AppError(404, 'Deleted user not found');
        }
        return user;
    }
    async bulkDeleteUsers(ids, deletedBy) {
        return user_model_1.User.updateMany({ _id: { $in: ids }, isDeleted: false }, { isDeleted: true, updatedBy: deletedBy });
    }
    async bulkUpdateUsers(ids, updateData, updatedBy) {
        return user_model_1.User.updateMany({ _id: { $in: ids }, isDeleted: false }, { ...updateData, updatedBy });
    }
}
exports.UserService = UserService;
exports.userService = new UserService();
exports.default = exports.userService;
