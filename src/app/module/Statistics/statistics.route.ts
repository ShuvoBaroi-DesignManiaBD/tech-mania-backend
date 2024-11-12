/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { StatisticsControllers } from './statistics.controller';

const router = express.Router();

router.get('/for-admin',
  auth(USER_ROLE.ADMIN),
  StatisticsControllers.getStatisticsForAdmin, 
);
export const statisticsRoutes = router;

