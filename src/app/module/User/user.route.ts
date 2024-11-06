/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { NextFunction, Request, Response } from "express";
import { UserControllers } from "./user.controller";
import { UserValidation } from "./user.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "./user.constant";
import validateRequest from "../../middlewares/validateRequest";
import { paymentInfoValidationSchema } from "../Payment/payment.validation";

const router = express.Router();


router.get(
  '/all-users',
  auth(USER_ROLE.ADMIN), 
  UserControllers.getAllUsers, 
);

router.get(
  '/suggested-users',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER), 
  UserControllers.getOtherUsers, 
);

router.get(
  '/user-profile/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER), 
  UserControllers.getAUser, 
);

router.get(
  '/current-user/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER), 
  UserControllers.getAUser, 
);

router.get(
  '/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER), 
  UserControllers.getAUser, 
);

router.post(
  "/create-user",
  validateRequest(UserValidation.newUserSchema),
  UserControllers.createUser
);

router.patch(
  "/update-user/:id",
  auth(USER_ROLE?.ADMIN),
  validateRequest(UserValidation.updateUserSchema),
  UserControllers.updateAUser
);

router.patch(
  "/verify-user/:id",
  auth(USER_ROLE?.ADMIN, USER_ROLE.USER),
  // validateRequest(paymentInfoValidationSchema),
  UserControllers.verifyAUser
);

router.patch(
  "/follow-user/:id",
  auth(USER_ROLE?.ADMIN, USER_ROLE.USER),
  UserControllers.followAUser
);

router.patch(
  "/unfollow-user/:id",
  auth(USER_ROLE?.ADMIN, USER_ROLE.USER),
  UserControllers.unFollowAUser
);

router.patch(
  "/add-follower/:id",
  auth(USER_ROLE?.ADMIN, USER_ROLE.USER),
  UserControllers.addFollower
);

router.patch(
  "/update-user-profile/:id",
  auth(USER_ROLE?.USER, USER_ROLE?.ADMIN),
  validateRequest(UserValidation.updateUserProfileSchema),
  UserControllers.updateUserProfile
);

export const userRoutes = router;
