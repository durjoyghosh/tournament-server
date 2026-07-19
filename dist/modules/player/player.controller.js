"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkUpdatePlayers = exports.bulkDeletePlayers = exports.restorePlayer = exports.deletePlayer = exports.updatePlayer = exports.getAllPlayers = exports.getMyPlayerProfile = exports.getPlayerById = exports.createPlayer = void 0;
const player_service_1 = require("./player.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const AppError_1 = require("../../utils/AppError");
exports.createPlayer = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    const player = await player_service_1.playerService.createPlayer(req.body, currentUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: 'Player profile created successfully',
        data: player,
    });
});
exports.getPlayerById = (0, catchAsync_1.default)(async (req, res) => {
    const player = await player_service_1.playerService.getPlayerById(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Player profile fetched successfully',
        data: player,
    });
});
exports.getMyPlayerProfile = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    const player = await player_service_1.playerService.getPlayerByUserId(currentUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'My player profile fetched successfully',
        data: player,
    });
});
exports.getAllPlayers = (0, catchAsync_1.default)(async (req, res) => {
    const result = await player_service_1.playerService.getAllPlayers(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Players fetched successfully',
        data: result.data,
        meta: result.meta,
    });
});
exports.updatePlayer = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    const player = await player_service_1.playerService.updatePlayer(req.params.id, req.body, currentUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Player profile updated successfully',
        data: player,
    });
});
exports.deletePlayer = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    await player_service_1.playerService.deletePlayer(req.params.id, currentUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Player profile deleted successfully',
    });
});
exports.restorePlayer = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    const player = await player_service_1.playerService.restorePlayer(req.params.id, currentUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Player profile restored successfully',
        data: player,
    });
});
exports.bulkDeletePlayers = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    const { ids } = req.body;
    await player_service_1.playerService.bulkDeletePlayers(ids, currentUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Players bulk deleted successfully',
    });
});
exports.bulkUpdatePlayers = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    const { ids, data } = req.body;
    await player_service_1.playerService.bulkUpdatePlayers(ids, data, currentUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Players bulk updated successfully',
    });
});
