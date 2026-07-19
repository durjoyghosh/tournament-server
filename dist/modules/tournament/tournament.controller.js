"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkUpdateTournaments = exports.bulkDeleteTournaments = exports.restoreTournament = exports.getMyTournaments = exports.addGalleryItem = exports.addSponsor = exports.addAnnouncement = exports.generateFixtures = exports.unregisterTeam = exports.registerTeam = exports.rejectTeam = exports.approveTeam = exports.applyTeam = exports.archiveTournament = exports.publishTournament = exports.deleteTournament = exports.updateTournament = exports.getAllTournaments = exports.getTournamentById = exports.createTournament = exports.updateSport = exports.getAllSports = exports.createSport = void 0;
const tournament_service_1 = require("./tournament.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const AppError_1 = require("../../utils/AppError");
exports.createSport = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    const sport = await tournament_service_1.tournamentService.createSport(req.body, currentUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: 'Sport created successfully',
        data: sport,
    });
});
exports.getAllSports = (0, catchAsync_1.default)(async (req, res) => {
    const sports = await tournament_service_1.tournamentService.getAllSports(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Sports fetched successfully',
        data: sports,
    });
});
exports.updateSport = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    const sport = await tournament_service_1.tournamentService.updateSport(req.params.id, req.body, currentUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Sport updated successfully',
        data: sport,
    });
});
exports.createTournament = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    const tournament = await tournament_service_1.tournamentService.createTournament(req.body, currentUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: 'Tournament created successfully',
        data: tournament,
    });
});
exports.getTournamentById = (0, catchAsync_1.default)(async (req, res) => {
    const tournament = await tournament_service_1.tournamentService.getTournamentById(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Tournament fetched successfully',
        data: tournament,
    });
});
exports.getAllTournaments = (0, catchAsync_1.default)(async (req, res) => {
    const result = await tournament_service_1.tournamentService.getAllTournaments(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Tournaments fetched successfully',
        data: result.data,
        meta: result.meta,
    });
});
exports.updateTournament = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    const tournament = await tournament_service_1.tournamentService.updateTournament(req.params.id, req.body, currentUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Tournament updated successfully',
        data: tournament,
    });
});
exports.deleteTournament = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    await tournament_service_1.tournamentService.deleteTournament(req.params.id, currentUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Tournament deleted successfully',
    });
});
exports.publishTournament = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    const tournament = await tournament_service_1.tournamentService.publishTournament(req.params.id, currentUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Tournament published successfully',
        data: tournament,
    });
});
exports.archiveTournament = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    const tournament = await tournament_service_1.tournamentService.archiveTournament(req.params.id, currentUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Tournament archived successfully',
        data: tournament,
    });
});
exports.applyTeam = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    const tournament = await tournament_service_1.tournamentService.applyTeam(req.params.id, req.body.teamId, currentUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Team application submitted successfully. Awaiting organizer approval.',
        data: tournament,
    });
});
exports.approveTeam = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    const tournament = await tournament_service_1.tournamentService.approveTeam(req.params.id, req.params.teamId, currentUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Team approved and added to tournament',
        data: tournament,
    });
});
exports.rejectTeam = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    const tournament = await tournament_service_1.tournamentService.rejectTeam(req.params.id, req.params.teamId, currentUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Team application rejected',
        data: tournament,
    });
});
exports.registerTeam = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    const tournament = await tournament_service_1.tournamentService.registerTeam(req.params.id, req.body.teamId, currentUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Team registered to tournament successfully',
        data: tournament,
    });
});
exports.unregisterTeam = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    const tournament = await tournament_service_1.tournamentService.unregisterTeam(req.params.id, req.body.teamId, currentUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Team unregistered from tournament successfully',
        data: tournament,
    });
});
exports.generateFixtures = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    const matches = await tournament_service_1.tournamentService.generateFixtures(req.params.id, req.body, currentUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: `${matches.length} fixture(s) generated successfully`,
        data: matches,
    });
});
exports.addAnnouncement = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    const tournament = await tournament_service_1.tournamentService.addAnnouncement(req.params.id, req.body, currentUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: 'Announcement published successfully',
        data: tournament,
    });
});
exports.addSponsor = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    const tournament = await tournament_service_1.tournamentService.addSponsor(req.params.id, req.body, currentUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: 'Sponsor added successfully',
        data: tournament,
    });
});
exports.addGalleryItem = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    const { imageUrl } = req.body;
    if (!imageUrl)
        throw new AppError_1.AppError(400, 'imageUrl is required');
    const tournament = await tournament_service_1.tournamentService.addGalleryItem(req.params.id, imageUrl, currentUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: 'Gallery item added successfully',
        data: tournament,
    });
});
exports.getMyTournaments = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    const result = await tournament_service_1.tournamentService.getMyTournaments(currentUserId, req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Your tournaments fetched successfully',
        data: result.data,
        meta: result.meta,
    });
});
exports.restoreTournament = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    const tournament = await tournament_service_1.tournamentService.restoreTournament(req.params.id, currentUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Tournament restored successfully',
        data: tournament,
    });
});
exports.bulkDeleteTournaments = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    const { ids } = req.body;
    await tournament_service_1.tournamentService.bulkDeleteTournaments(ids, currentUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Tournaments bulk deleted successfully',
    });
});
exports.bulkUpdateTournaments = (0, catchAsync_1.default)(async (req, res) => {
    const currentUserId = req.user?.id;
    if (!currentUserId)
        throw new AppError_1.AppError(401, 'Unauthorized');
    const { ids, data } = req.body;
    await tournament_service_1.tournamentService.bulkUpdateTournaments(ids, data, currentUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Tournaments bulk updated successfully',
    });
});
