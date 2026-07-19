"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkDeleteMatches = exports.restoreMatch = exports.getMyScorekeeperMatches = exports.getMyAssignedMatches = exports.updateLineup = exports.submitRefereeReport = exports.halftimeMatch = exports.startMatch = exports.updateRefereeStatus = exports.addMatchEvent = exports.endMatch = exports.updateLiveScore = exports.deleteMatch = exports.updateMatch = exports.getAllMatches = exports.getMatchById = exports.createMatch = void 0;
const match_service_1 = require("./match.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const AppError_1 = require("../../utils/AppError");
exports.createMatch = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    const match = await match_service_1.matchService.createMatch(req.body, currentUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: 'Match scheduled successfully',
        data: match,
    });
});
exports.getMatchById = (0, catchAsync_1.default)(async (req, res) => {
    const match = await match_service_1.matchService.getMatchById(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Match fetched successfully',
        data: match,
    });
});
exports.getAllMatches = (0, catchAsync_1.default)(async (req, res) => {
    const result = await match_service_1.matchService.getAllMatches(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Matches fetched successfully',
        data: result.data,
        meta: result.meta,
    });
});
exports.updateMatch = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    const match = await match_service_1.matchService.updateMatch(req.params.id, req.body, currentUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Match updated successfully',
        data: match,
    });
});
exports.deleteMatch = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    await match_service_1.matchService.deleteMatch(req.params.id, currentUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Match deleted successfully',
    });
});
exports.updateLiveScore = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    const { score, event } = req.body;
    const match = await match_service_1.matchService.updateLiveScore(req.params.id, score, event, currentUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Live score updated successfully',
        data: match,
    });
});
exports.endMatch = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    const { score } = req.body;
    const match = await match_service_1.matchService.endMatch(req.params.id, score, currentUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Match ended and finalized successfully',
        data: match,
    });
});
exports.addMatchEvent = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    const { event, score, minute } = req.body;
    const match = await match_service_1.matchService.addMatchEvent(req.params.id, event, score, minute, currentUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Match event added successfully',
        data: match,
    });
});
exports.updateRefereeStatus = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    const { status, reason } = req.body;
    const match = await match_service_1.matchService.updateRefereeStatus(req.params.id, currentUserId, status, reason);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Referee status updated successfully',
        data: match,
    });
});
exports.startMatch = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    const match = await match_service_1.matchService.startMatch(req.params.id, currentUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Match started successfully',
        data: match,
    });
});
exports.halftimeMatch = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    const match = await match_service_1.matchService.halftimeMatch(req.params.id, currentUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Match halftime set successfully',
        data: match,
    });
});
exports.submitRefereeReport = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    const { report } = req.body;
    const match = await match_service_1.matchService.submitRefereeReport(req.params.id, report, currentUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Referee report submitted successfully',
        data: match,
    });
});
exports.updateLineup = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    const { side, starting, substitutes } = req.body;
    const match = await match_service_1.matchService.updateLineup(req.params.id, side, starting, substitutes, currentUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Lineup updated successfully',
        data: match,
    });
});
exports.getMyAssignedMatches = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    const result = await match_service_1.matchService.getMyAssignedMatches(currentUserId, req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Assigned matches fetched successfully',
        data: result.data,
        meta: result.meta,
    });
});
exports.getMyScorekeeperMatches = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    const result = await match_service_1.matchService.getMyScorekeeperMatches(currentUserId, req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Scorekeeper matches fetched successfully',
        data: result.data,
        meta: result.meta,
    });
});
exports.restoreMatch = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    const match = await match_service_1.matchService.restoreMatch(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Match restored successfully',
        data: match,
    });
});
exports.bulkDeleteMatches = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    const { ids } = req.body;
    await match_service_1.matchService.bulkDeleteMatches(ids, currentUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Matches bulk deleted successfully',
    });
});
