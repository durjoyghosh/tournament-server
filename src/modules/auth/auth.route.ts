import { Router } from 'express';
import * as authController from './auth.controller';
import { validate } from '../../middlewares/validate.middleware';
import { protect } from '../../middlewares/auth.middleware';
import {
  registerValidationSchema,
  loginValidationSchema,
  refreshTokenValidationSchema,
  forgotPasswordValidationSchema,
  resetPasswordValidationSchema,
  changePasswordValidationSchema,
} from './auth.validation';

const router = Router();

router.post('/register', validate(registerValidationSchema), authController.register);
router.post('/login', validate(loginValidationSchema), authController.login);
router.post('/refresh', validate(refreshTokenValidationSchema), authController.refresh);
router.post('/logout', authController.logout);
router.post('/forgot-password', validate(forgotPasswordValidationSchema), authController.forgotPassword);
router.post('/reset-password', validate(resetPasswordValidationSchema), authController.resetPassword);

// Protected routes
router.patch('/change-password', protect, validate(changePasswordValidationSchema), authController.changePassword);

export const authRoutes = router;
export default authRoutes;
