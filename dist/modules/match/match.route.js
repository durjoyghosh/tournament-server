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
exports.matchRoutes = void 0;
const express_1 = require("express");
const matchController = __importStar(require("./match.controller"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_middleware_1 = require("../../middlewares/role.middleware");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const match_validation_1 = require("./match.validation");
const router = (0, express_1.Router)();
// ---- CRUD (Organizer / Admin) ----
router.post('/', auth_middleware_1.protect, (0, role_middleware_1.authorize)('Super Admin', 'Organizer'), (0, validate_middleware_1.validate)(match_validation_1.createMatchValidationSchema), matchController.createMatch);
router.get('/', (0, validate_middleware_1.validate)(match_validation_1.queryMatchValidationSchema), matchController.getAllMatches);
router.get('/:id', (0, validate_middleware_1.validate)(match_validation_1.matchParamsValidationSchema), matchController.getMatchById);
router.patch('/:id', auth_middleware_1.protect, (0, role_middleware_1.authorize)('Super Admin', 'Organizer'), (0, validate_middleware_1.validate)(match_validation_1.matchParamsValidationSchema), (0, validate_middleware_1.validate)(match_validation_1.updateMatchValidationSchema), matchController.updateMatch);
router.delete('/:id', auth_middleware_1.protect, (0, role_middleware_1.authorize)('Super Admin', 'Organizer'), (0, validate_middleware_1.validate)(match_validation_1.matchParamsValidationSchema), matchController.deleteMatch);
// ---- Live Score Update (Scorekeeper only) ----
router.patch('/:id/score', auth_middleware_1.protect, (0, role_middleware_1.authorize)('Scorekeeper', 'Super Admin'), (0, validate_middleware_1.validate)(match_validation_1.matchParamsValidationSchema), (0, validate_middleware_1.validate)(match_validation_1.updateScoreValidationSchema), matchController.updateLiveScore);
// ---- Record match event without necessarily changing score ----
router.post('/:id/events', auth_middleware_1.protect, (0, role_middleware_1.authorize)('Scorekeeper', 'Referee', 'Super Admin'), (0, validate_middleware_1.validate)(match_validation_1.matchParamsValidationSchema), (0, validate_middleware_1.validate)(match_validation_1.matchEventValidationSchema), matchController.addMatchEvent);
// ---- End Match (Referee only) ----
router.post('/:id/end', auth_middleware_1.protect, (0, role_middleware_1.authorize)('Referee', 'Super Admin'), (0, validate_middleware_1.validate)(match_validation_1.matchParamsValidationSchema), (0, validate_middleware_1.validate)(match_validation_1.updateScoreValidationSchema), matchController.endMatch);
// ---- Referee: Accept / Reject assignment ----
router.patch('/:id/referee-status', auth_middleware_1.protect, (0, role_middleware_1.authorize)('Referee'), (0, validate_middleware_1.validate)(match_validation_1.matchParamsValidationSchema), (0, validate_middleware_1.validate)(match_validation_1.refereeStatusValidationSchema), matchController.updateRefereeStatus);
// ---- Referee: Start match ----
router.patch('/:id/start', auth_middleware_1.protect, (0, role_middleware_1.authorize)('Referee', 'Super Admin'), (0, validate_middleware_1.validate)(match_validation_1.matchParamsValidationSchema), matchController.startMatch);
// ---- Referee: Pause (Halftime) ----
router.patch('/:id/halftime', auth_middleware_1.protect, (0, role_middleware_1.authorize)('Referee', 'Super Admin'), (0, validate_middleware_1.validate)(match_validation_1.matchParamsValidationSchema), matchController.halftimeMatch);
// ---- Referee: Submit official report ----
router.patch('/:id/report', auth_middleware_1.protect, (0, role_middleware_1.authorize)('Referee', 'Super Admin'), (0, validate_middleware_1.validate)(match_validation_1.matchParamsValidationSchema), (0, validate_middleware_1.validate)(match_validation_1.refereeReportValidationSchema), matchController.submitRefereeReport);
// ---- Coach: Update lineup ----
router.patch('/:id/lineup', auth_middleware_1.protect, (0, role_middleware_1.authorize)('Coach', 'Team Manager', 'Super Admin'), (0, validate_middleware_1.validate)(match_validation_1.matchParamsValidationSchema), (0, validate_middleware_1.validate)(match_validation_1.lineupValidationSchema), matchController.updateLineup);
// ---- Referee dashboard: get assigned matches ----
router.get('/assigned/me', auth_middleware_1.protect, (0, role_middleware_1.authorize)('Referee'), matchController.getMyAssignedMatches);
// ---- Scorekeeper dashboard: get assigned matches ----
router.get('/scorekeeper/me', auth_middleware_1.protect, (0, role_middleware_1.authorize)('Scorekeeper'), matchController.getMyScorekeeperMatches);
// ---- Bulk Delete matches (Admin / Organizer) ----
router.post('/bulk-delete', auth_middleware_1.protect, (0, role_middleware_1.authorize)('Super Admin', 'Organizer'), (0, validate_middleware_1.validate)(match_validation_1.bulkMatchValidationSchema), matchController.bulkDeleteMatches);
// ---- Restore soft-deleted match (Admin / Organizer) ----
router.patch('/:id/restore', auth_middleware_1.protect, (0, role_middleware_1.authorize)('Super Admin', 'Organizer'), (0, validate_middleware_1.validate)(match_validation_1.matchParamsValidationSchema), matchController.restoreMatch);
exports.matchRoutes = router;
exports.default = exports.matchRoutes;
