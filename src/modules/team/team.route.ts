import { Router } from 'express';
import * as teamController from './team.controller';
import { protect } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';
import { validate } from '../../middlewares/validate.middleware';
import {
  createTeamValidationSchema,
  updateTeamValidationSchema,
  queryTeamValidationSchema,
  teamParamsValidationSchema,
} from './team.validation';

const router = Router();

router.post(
  '/',
  protect,
  authorize('Super Admin', 'Organizer', 'Team Manager'),
  validate(createTeamValidationSchema),
  teamController.createTeam
);

router.get('/', validate(queryTeamValidationSchema), teamController.getAllTeams);

router.get('/:id', validate(teamParamsValidationSchema), teamController.getTeamById);

router.patch(
  '/:id',
  protect,
  authorize('Super Admin', 'Organizer', 'Team Manager'),
  validate(teamParamsValidationSchema),
  validate(updateTeamValidationSchema),
  teamController.updateTeam
);

router.delete(
  '/:id',
  protect,
  authorize('Super Admin', 'Organizer'),
  validate(teamParamsValidationSchema),
  teamController.deleteTeam
);

export const teamRoutes = router;
export default teamRoutes;
