import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { authControllers } from './auth.controller';
import { AuthValidation } from './auth.validation';
const router = Router();


router.post(
  '/signin',
  validateRequest(AuthValidation.loginValidationSchema),
  authControllers.signIn,
);

router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenValidationSchema),
  authControllers.refreshToken,
);

export const authRoutes = router;
