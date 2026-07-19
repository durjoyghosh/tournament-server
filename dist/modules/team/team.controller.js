"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkUpdateTeams = exports.bulkDeleteTeams = exports.restoreTeam = exports.deleteTeam = exports.updateTeam = exports.getAllTeams = exports.getTeamById = exports.createTeam = void 0;
const team_service_1 = require("./team.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const AppError_1 = require("../../utils/AppError");
exports.createTeam = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    const team = await team_service_1.teamService.createTeam(req.body, currentUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: 'Team created successfully',
        data: team,
    });
});
exports.getTeamById = (0, catchAsync_1.default)(async (req, res) => {
    const team = await team_service_1.teamService.getTeamById(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Team fetched successfully',
        data: team,
    });
});
exports.getAllTeams = (0, catchAsync_1.default)(async (req, res) => {
    const result = await team_service_1.teamService.getAllTeams(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Teams fetched successfully',
        data: result.data,
        meta: result.meta,
    });
});
exports.updateTeam = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    const team = await team_service_1.teamService.updateTeam(req.params.id, req.body, currentUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Team updated successfully',
        data: team,
    });
});
exports.deleteTeam = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    await team_service_1.teamService.deleteTeam(req.params.id, currentUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Team deleted successfully',
    });
});
exports.restoreTeam = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    const team = await team_service_1.teamService.restoreTeam(req.params.id, currentUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Team restored successfully',
        data: team,
    });
});
exports.bulkDeleteTeams = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    const { ids } = req.body;
    await team_service_1.teamService.bulkDeleteTeams(ids, currentUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Teams bulk deleted successfully',
    });
});
exports.bulkUpdateTeams = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    const { ids, data } = req.body;
    await team_service_1.teamService.bulkUpdateTeams(ids, data, currentUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Teams bulk updated successfully',
    });
});
