import { Router } from 'express';
import * as tournamentController from './tournament.controller';
import { protect } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';
import { validate } from '../../middlewares/validate.middleware';
import {
  createSportValidationSchema,
  updateSportValidationSchema,
  createTournamentValidationSchema,
  updateTournamentValidationSchema,
  queryTournamentValidationSchema,
  registerTeamValidationSchema,
  tournamentParamsValidationSchema,
} from './tournament.validation';

const router = Router();

// ---- Sport routes ----
router.post(
  '/sports',
  protect,
  authorize('Super Admin'),
  validate(createSportValidationSchema),
  tournamentController.createSport
);
router.get('/sports', tournamentController.getAllSports);
router.patch(
  '/sports/:id',
  protect,
  authorize('Super Admin'),
  tournamentController.updateSport
);

// ---- Tournament CRUD ----
router.post(
  '/',
  protect,
  authorize('Super Admin', 'Organizer'),
  validate(createTournamentValidationSchema),
  tournamentController.createTournament
);

router.get('/', validate(queryTournamentValidationSchema), tournamentController.getAllTournaments);

router.get('/:id', validate(tournamentParamsValidationSchema), tournamentController.getTournamentById);

router.patch(
  '/:id',
  protect,
  authorize('Super Admin', 'Organizer'),
  validate(tournamentParamsValidationSchema),
  validate(updateTournamentValidationSchema),
  tournamentController.updateTournament
);

router.delete(
  '/:id',
  protect,
  authorize('Super Admin', 'Organizer'),
  validate(tournamentParamsValidationSchema),
  tournamentController.deleteTournament
);

// ---- Publish / Archive ----
router.patch(
  '/:id/publish',
  protect,
  authorize('Super Admin', 'Organizer'),
  validate(tournamentParamsValidationSchema),
  tournamentController.publishTournament
);

router.patch(
  '/:id/archive',
  protect,
  authorize('Super Admin', 'Organizer'),
  validate(tournamentParamsValidationSchema),
  tournamentController.archiveTournament
);

// ---- Registration: Team applies ----
router.post(
  '/:id/apply',
  protect,
  authorize('Team Manager'),
  validate(tournamentParamsValidationSchema),
  validate(registerTeamValidationSchema),
  tournamentController.applyTeam
);

// ---- Registration: Organizer approves/rejects pending teams ----
router.patch(
  '/:id/teams/:teamId/approve',
  protect,
  authorize('Super Admin', 'Organizer'),
  tournamentController.approveTeam
);

router.patch(
  '/:id/teams/:teamId/reject',
  protect,
  authorize('Super Admin', 'Organizer'),
  tournamentController.rejectTeam
);

// ---- Legacy register/unregister (direct, no approval) ----
router.post(
  '/:id/register',
  protect,
  authorize('Super Admin', 'Organizer'),
  validate(tournamentParamsValidationSchema),
  validate(registerTeamValidationSchema),
  tournamentController.registerTeam
);

router.post(
  '/:id/unregister',
  protect,
  authorize('Super Admin', 'Organizer'),
  validate(tournamentParamsValidationSchema),
  validate(registerTeamValidationSchema),
  tournamentController.unregisterTeam
);

// ---- Fixture Generator ----
router.post(
  '/:id/fixtures',
  protect,
  authorize('Super Admin', 'Organizer'),
  validate(tournamentParamsValidationSchema),
  tournamentController.generateFixtures
);

// ---- Announcements ----
router.post(
  '/:id/announcements',
  protect,
  authorize('Super Admin', 'Organizer'),
  validate(tournamentParamsValidationSchema),
  tournamentController.addAnnouncement
);

// ---- Sponsors ----
router.post(
  '/:id/sponsors',
  protect,
  authorize('Super Admin', 'Organizer'),
  validate(tournamentParamsValidationSchema),
  tournamentController.addSponsor
);

// ---- Gallery ----
router.post(
  '/:id/gallery',
  protect,
  authorize('Super Admin', 'Organizer'),
  validate(tournamentParamsValidationSchema),
  tournamentController.addGalleryItem
);

// ---- Organizer's own tournaments ----
router.get(
  '/my/tournaments',
  protect,
  authorize('Super Admin', 'Organizer'),
  tournamentController.getMyTournaments
);

export const tournamentRoutes = router;
export default tournamentRoutes;
