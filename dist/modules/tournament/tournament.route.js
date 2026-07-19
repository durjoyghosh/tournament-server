"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.tournamentRoutes = void 0;
const express_1 = require("express");
const tournamentController = __importStar(require("./tournament.controller"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_middleware_1 = require("../../middlewares/role.middleware");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const tournament_validation_1 = require("./tournament.validation");
const router = (0, express_1.Router)();
// ---- Sport routes ----
router.post('/sports', auth_middleware_1.protect, (0, role_middleware_1.authorize)('Super Admin'), (0, validate_middleware_1.validate)(tournament_validation_1.createSportValidationSchema), tournamentController.createSport);
router.get('/sports', tournamentController.getAllSports);
router.patch('/sports/:id', auth_middleware_1.protect, (0, role_middleware_1.authorize)('Super Admin'), tournamentController.updateSport);
// ---- Tournament CRUD ----
router.post('/', auth_middleware_1.protect, (0, role_middleware_1.authorize)('Super Admin', 'Organizer'), (0, validate_middleware_1.validate)(tournament_validation_1.createTournamentValidationSchema), tournamentController.createTournament);
router.get('/', (0, validate_middleware_1.validate)(tournament_validation_1.queryTournamentValidationSchema), tournamentController.getAllTournaments);
router.post('/bulk-delete', auth_middleware_1.protect, (0, role_middleware_1.authorize)('Super Admin', 'Organizer'), tournamentController.bulkDeleteTournaments);
router.post('/bulk-update', auth_middleware_1.protect, (0, role_middleware_1.authorize)('Super Admin', 'Organizer'), tournamentController.bulkUpdateTournaments);
router.post('/:id/restore', auth_middleware_1.protect, (0, role_middleware_1.authorize)('Super Admin', 'Organizer'), (0, validate_middleware_1.validate)(tournament_validation_1.tournamentParamsValidationSchema), tournamentController.restoreTournament);
router.get('/:id', (0, validate_middleware_1.validate)(tournament_validation_1.tournamentParamsValidationSchema), tournamentController.getTournamentById);
router.patch('/:id', auth_middleware_1.protect, (0, role_middleware_1.authorize)('Super Admin', 'Organizer'), (0, validate_middleware_1.validate)(tournament_validation_1.tournamentParamsValidationSchema), (0, validate_middleware_1.validate)(tournament_validation_1.updateTournamentValidationSchema), tournamentController.updateTournament);
router.delete('/:id', auth_middleware_1.protect, (0, role_middleware_1.authorize)('Super Admin', 'Organizer'), (0, validate_middleware_1.validate)(tournament_validation_1.tournamentParamsValidationSchema), tournamentController.deleteTournament);
// ---- Publish / Archive ----
router.patch('/:id/publish', auth_middleware_1.protect, (0, role_middleware_1.authorize)('Super Admin', 'Organizer'), (0, validate_middleware_1.validate)(tournament_validation_1.tournamentParamsValidationSchema), tournamentController.publishTournament);
router.patch('/:id/archive', auth_middleware_1.protect, (0, role_middleware_1.authorize)('Super Admin', 'Organizer'), (0, validate_middleware_1.validate)(tournament_validation_1.tournamentParamsValidationSchema), tournamentController.archiveTournament);
// ---- Registration: Team applies ----
router.post('/:id/apply', auth_middleware_1.protect, (0, role_middleware_1.authorize)('Team Manager'), (0, validate_middleware_1.validate)(tournament_validation_1.tournamentParamsValidationSchema), (0, validate_middleware_1.validate)(tournament_validation_1.registerTeamValidationSchema), tournamentController.applyTeam);
// ---- Registration: Organizer approves/rejects pending teams ----
router.patch('/:id/teams/:teamId/approve', auth_middleware_1.protect, (0, role_middleware_1.authorize)('Super Admin', 'Organizer'), tournamentController.approveTeam);
router.patch('/:id/teams/:teamId/reject', auth_middleware_1.protect, (0, role_middleware_1.authorize)('Super Admin', 'Organizer'), tournamentController.rejectTeam);
// ---- Legacy register/unregister (direct, no approval) ----
router.post('/:id/register', auth_middleware_1.protect, (0, role_middleware_1.authorize)('Super Admin', 'Organizer'), (0, validate_middleware_1.validate)(tournament_validation_1.tournamentParamsValidationSchema), (0, validate_middleware_1.validate)(tournament_validation_1.registerTeamValidationSchema), tournamentController.registerTeam);
router.post('/:id/unregister', auth_middleware_1.protect, (0, role_middleware_1.authorize)('Super Admin', 'Organizer'), (0, validate_middleware_1.validate)(tournament_validation_1.tournamentParamsValidationSchema), (0, validate_middleware_1.validate)(tournament_validation_1.registerTeamValidationSchema), tournamentController.unregisterTeam);
// ---- Fixture Generator ----
router.post('/:id/fixtures', auth_middleware_1.protect, (0, role_middleware_1.authorize)('Super Admin', 'Organizer'), (0, validate_middleware_1.validate)(tournament_validation_1.tournamentParamsValidationSchema), tournamentController.generateFixtures);
// ---- Announcements ----
router.post('/:id/announcements', auth_middleware_1.protect, (0, role_middleware_1.authorize)('Super Admin', 'Organizer'), (0, validate_middleware_1.validate)(tournament_validation_1.tournamentParamsValidationSchema), tournamentController.addAnnouncement);
// ---- Sponsors ----
router.post('/:id/sponsors', auth_middleware_1.protect, (0, role_middleware_1.authorize)('Super Admin', 'Organizer'), (0, validate_middleware_1.validate)(tournament_validation_1.tournamentParamsValidationSchema), tournamentController.addSponsor);
// ---- Gallery ----
router.post('/:id/gallery', auth_middleware_1.protect, (0, role_middleware_1.authorize)('Super Admin', 'Organizer'), (0, validate_middleware_1.validate)(tournament_validation_1.tournamentParamsValidationSchema), tournamentController.addGalleryItem);
// ---- Organizer's own tournaments ----
router.get('/my/tournaments', auth_middleware_1.protect, (0, role_middleware_1.authorize)('Super Admin', 'Organizer'), tournamentController.getMyTournaments);
exports.tournamentRoutes = router;
exports.default = exports.tournamentRoutes;
