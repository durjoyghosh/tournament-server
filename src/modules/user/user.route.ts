import { Router } from 'express';
import { protect } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';
import { validate } from '../../middlewares/validate.middleware';
import * as userController from './user.controller';
import {
  createUserValidationSchema,
  updateUserValidationSchema,
  queryUserValidationSchema,
  userParamsValidationSchema,
} from './user.validation';

const router = Router();

// ---- Self-service endpoints ----
router.get('/me', protect, userController.getMe);
router.patch('/me', protect, validate(updateUserValidationSchema), userController.updateMe);

// ---- Super Admin: User Management ----
router.post(
  '/',
  protect,
  authorize('Super Admin', 'Organizer'),
  validate(createUserValidationSchema),
  userController.createUser
);

router.get(
  '/',
  protect,
  authorize('Super Admin', 'Organizer'),
  validate(queryUserValidationSchema),
  userController.getAllUsers
);

router.get(
  '/:id',
  protect,
  authorize('Super Admin', 'Organizer'),
  validate(userParamsValidationSchema),
  userController.getUserById
);

router.patch(
  '/:id',
  protect,
  authorize('Super Admin', 'Organizer'),
  validate(userParamsValidationSchema.merge(updateUserValidationSchema)),
  userController.updateUser
);

router.delete(
  '/:id',
  protect,
  authorize('Super Admin'),
  validate(userParamsValidationSchema),
  userController.deleteUser
);

// ---- Super Admin: Suspend / Activate user account ----
router.patch(
  '/:id/status',
  protect,
  authorize('Super Admin'),
  validate(userParamsValidationSchema),
  userController.updateUserStatus
);

// ---- Super Admin: Organizer Approval Workflow ----
router.get(
  '/organizers/pending',
  protect,
  authorize('Super Admin'),
  userController.getPendingOrganizers
);

router.patch(
  '/organizers/:id/approve',
  protect,
  authorize('Super Admin'),
  validate(userParamsValidationSchema),
  userController.approveOrganizer
);

router.patch(
  '/organizers/:id/reject',
  protect,
  authorize('Super Admin'),
  validate(userParamsValidationSchema),
  userController.rejectOrganizer
);

// ---- Admin: Platform Analytics ----
router.get(
  '/admin/analytics',
  protect,
  authorize('Super Admin'),
  userController.getPlatformAnalytics
);

// ---- Admin: Activity Logs ----
router.get(
  '/admin/logs',
  protect,
  authorize('Super Admin'),
  userController.getActivityLogs
);

export const userRoutes = router;
export default userRoutes;
