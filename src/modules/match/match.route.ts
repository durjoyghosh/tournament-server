import { Router } from 'express';
import * as matchController from './match.controller';
import { protect } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';
import { validate } from '../../middlewares/validate.middleware';
import {
  createMatchValidationSchema,
  updateMatchValidationSchema,
  updateScoreValidationSchema,
  matchEventValidationSchema,
  lineupValidationSchema,
  refereeStatusValidationSchema,
  refereeReportValidationSchema,
  queryMatchValidationSchema,
  matchParamsValidationSchema,
  bulkMatchValidationSchema,
} from './match.validation';

const router = Router();

// ---- CRUD (Organizer / Admin) ----
router.post(
  '/',
  protect,
  authorize('Super Admin', 'Organizer'),
  validate(createMatchValidationSchema),
  matchController.createMatch
);

router.get('/', validate(queryMatchValidationSchema), matchController.getAllMatches);

router.get('/:id', validate(matchParamsValidationSchema), matchController.getMatchById);

router.patch(
  '/:id',
  protect,
  authorize('Super Admin', 'Organizer'),
  validate(matchParamsValidationSchema),
  validate(updateMatchValidationSchema),
  matchController.updateMatch
);

router.delete(
  '/:id',
  protect,
  authorize('Super Admin', 'Organizer'),
  validate(matchParamsValidationSchema),
  matchController.deleteMatch
);

// ---- Live Score Update (Scorekeeper only) ----
router.patch(
  '/:id/score',
  protect,
  authorize('Scorekeeper', 'Super Admin'),
  validate(matchParamsValidationSchema),
  validate(updateScoreValidationSchema),
  matchController.updateLiveScore
);

// ---- Record match event without necessarily changing score ----
router.post(
  '/:id/events',
  protect,
  authorize('Scorekeeper', 'Referee', 'Super Admin'),
  validate(matchParamsValidationSchema),
  validate(matchEventValidationSchema),
  matchController.addMatchEvent
);

// ---- End Match (Referee only) ----
router.post(
  '/:id/end',
  protect,
  authorize('Referee', 'Super Admin'),
  validate(matchParamsValidationSchema),
  validate(updateScoreValidationSchema),
  matchController.endMatch
);

// ---- Referee: Accept / Reject assignment ----
router.patch(
  '/:id/referee-status',
  protect,
  authorize('Referee'),
  validate(matchParamsValidationSchema),
  validate(refereeStatusValidationSchema),
  matchController.updateRefereeStatus
);

// ---- Referee: Start match ----
router.patch(
  '/:id/start',
  protect,
  authorize('Referee', 'Super Admin'),
  validate(matchParamsValidationSchema),
  matchController.startMatch
);

// ---- Referee: Pause (Halftime) ----
router.patch(
  '/:id/halftime',
  protect,
  authorize('Referee', 'Super Admin'),
  validate(matchParamsValidationSchema),
  matchController.halftimeMatch
);

// ---- Referee: Submit official report ----
router.patch(
  '/:id/report',
  protect,
  authorize('Referee', 'Super Admin'),
  validate(matchParamsValidationSchema),
  validate(refereeReportValidationSchema),
  matchController.submitRefereeReport
);

// ---- Coach: Update lineup ----
router.patch(
  '/:id/lineup',
  protect,
  authorize('Coach', 'Team Manager', 'Super Admin'),
  validate(matchParamsValidationSchema),
  validate(lineupValidationSchema),
  matchController.updateLineup
);

// ---- Referee dashboard: get assigned matches ----
router.get(
  '/assigned/me',
  protect,
  authorize('Referee'),
  matchController.getMyAssignedMatches
);

// ---- Scorekeeper dashboard: get assigned matches ----
router.get(
  '/scorekeeper/me',
  protect,
  authorize('Scorekeeper'),
  matchController.getMyScorekeeperMatches
);

// ---- Bulk Delete matches (Admin / Organizer) ----
router.post(
  '/bulk-delete',
  protect,
  authorize('Super Admin', 'Organizer'),
  validate(bulkMatchValidationSchema),
  matchController.bulkDeleteMatches
);

// ---- Restore soft-deleted match (Admin / Organizer) ----
router.patch(
  '/:id/restore',
  protect,
  authorize('Super Admin', 'Organizer'),
  validate(matchParamsValidationSchema),
  matchController.restoreMatch
);

export const matchRoutes = router;
export default matchRoutes;
