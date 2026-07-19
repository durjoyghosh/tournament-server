"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.teamService = exports.TeamService = void 0;
const team_repository_1 = require("./team.repository");
const team_model_1 = require("./team.model");
const AppError_1 = require("../../utils/AppError");
const user_model_1 = require("../user/user.model");
class TeamService {
    async createTeam(data, userId) {
        // Verify unique name
        const existing = await team_repository_1.teamRepository.findAll({ search: data.name });
        const isDuplicate = existing.data.some((t) => t.name.toLowerCase() === data.name?.toLowerCase());
        if (isDuplicate) {
            throw new AppError_1.AppError(409, 'Team name is already registered');
        }
        // Verify manager exists and has appropriate role
        if (data.manager) {
            const managerUser = await user_model_1.User.findOne({ _id: data.manager, isDeleted: false });
            if (!managerUser) {
                throw new AppError_1.AppError(404, 'Manager user not found');
            }
            if (managerUser.role !== 'Team Manager' && managerUser.role !== 'Super Admin' && managerUser.role !== 'Organizer') {
                throw new AppError_1.AppError(400, 'Assigned user does not have Team Manager role privileges');
            }
        }
        // Verify coach exists
        if (data.coach) {
            const coachUser = await user_model_1.User.findOne({ _id: data.coach, isDeleted: false });
            if (!coachUser) {
                throw new AppError_1.AppError(404, 'Coach user not found');
            }
        }
        return team_repository_1.teamRepository.create({
            ...data,
            createdBy: userId,
        });
    }
    async getTeamById(id) {
        const team = await team_repository_1.teamRepository.findById(id);
        if (!team) {
            throw new AppError_1.AppError(404, 'Team not found');
        }
        return team;
    }
    async getAllTeams(query) {
        return team_repository_1.teamRepository.findAll(query);
    }
    async updateTeam(id, data, userId) {
        const team = await team_repository_1.teamRepository.findById(id);
        if (!team) {
            throw new AppError_1.AppError(404, 'Team not found');
        }
        if (data.name) {
            const existing = await team_repository_1.teamRepository.findAll({ search: data.name });
            const isDuplicate = existing.data.some((t) => t.name.toLowerCase() === data.name?.toLowerCase() && t.id !== id);
            if (isDuplicate) {
                throw new AppError_1.AppError(409, 'Team name is already in use by another team');
            }
        }
        if (data.manager) {
            const managerUser = await user_model_1.User.findOne({ _id: data.manager, isDeleted: false });
            if (!managerUser) {
                throw new AppError_1.AppError(404, 'Manager user not found');
            }
        }
        if (data.coach) {
            const coachUser = await user_model_1.User.findOne({ _id: data.coach, isDeleted: false });
            if (!coachUser) {
                throw new AppError_1.AppError(404, 'Coach user not found');
            }
        }
        const updated = await team_repository_1.teamRepository.update(id, {
            ...data,
            updatedBy: userId,
        });
        if (!updated) {
            throw new AppError_1.AppError(400, 'Could not update team');
        }
        return updated;
    }
    async deleteTeam(id, userId) {
        const team = await team_repository_1.teamRepository.findById(id);
        if (!team) {
            throw new AppError_1.AppError(404, 'Team not found');
        }
        await team_repository_1.teamRepository.softDelete(id, userId);
    }
    async restoreTeam(id, updatedBy) {
        const team = await team_model_1.Team.findOneAndUpdate({ _id: id, isDeleted: true }, { isDeleted: false, updatedBy }, { new: true });
        if (!team) {
            throw new AppError_1.AppError(404, 'Deleted team not found');
        }
        return team;
    }
    async bulkDeleteTeams(ids, deletedBy) {
        return team_model_1.Team.updateMany({ _id: { $in: ids }, isDeleted: false }, { isDeleted: true, updatedBy: deletedBy });
    }
    async bulkUpdateTeams(ids, updateData, updatedBy) {
        return team_model_1.Team.updateMany({ _id: { $in: ids }, isDeleted: false }, { ...updateData, updatedBy });
    }
}
exports.TeamService = TeamService;
exports.teamService = new TeamService();
exports.default = exports.teamService;
