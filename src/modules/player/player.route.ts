import { Router } from 'express';
import * as playerController from './player.controller';
import { protect } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';
import { validate } from '../../middlewares/validate.middleware';
import {
  createPlayerValidationSchema,
  updatePlayerValidationSchema,
  queryPlayerValidationSchema,
  playerParamsValidationSchema,
} from './player.validation';

const router = Router();

router.get('/me', protect, playerController.getMyPlayerProfile);

router.post(
  '/',
  protect,
  authorize('Super Admin', 'Organizer', 'Team Manager'),
  validate(createPlayerValidationSchema),
  playerController.createPlayer
);

router.get('/', validate(queryPlayerValidationSchema), playerController.getAllPlayers);

router.get('/:id', validate(playerParamsValidationSchema), playerController.getPlayerById);

router.patch(
  '/:id',
  protect,
  authorize('Super Admin', 'Organizer', 'Team Manager'),
  validate(playerParamsValidationSchema),
  validate(updatePlayerValidationSchema),
  playerController.updatePlayer
);

router.delete(
  '/:id',
  protect,
  authorize('Super Admin', 'Organizer'),
  validate(playerParamsValidationSchema),
  playerController.deletePlayer
);

export const playerRoutes = router;
export default playerRoutes;
