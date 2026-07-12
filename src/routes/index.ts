import { Router } from 'express';
import { authRoutes } from '../modules/auth/auth.route';
import { userRoutes } from '../modules/user/user.route';
import { tournamentRoutes } from '../modules/tournament/tournament.route';
import { teamRoutes } from '../modules/team/team.route';
import { playerRoutes } from '../modules/player/player.route';
import { matchRoutes } from '../modules/match/match.route';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/tournaments', tournamentRoutes);
router.use('/teams', teamRoutes);
router.use('/players', playerRoutes);
router.use('/matches', matchRoutes);

export const apiRouter = router;
export default apiRouter;
