/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { NextFunction, Request, Response } from "express";
import { UserControllers } from "./user.controller";
import { UserValidation } from "./comment.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "./user.constant";
import validateRequest from "../../middlewares/validateRequest";

const router = express.Router();


router.get(
  '/all-users',
  auth(USER_ROLE.ADMIN), 
  UserControllers.getAllUsers, 
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
  "/update-user-profile/:id",
  auth(USER_ROLE?.USER, USER_ROLE?.ADMIN),
  validateRequest(UserValidation.updateUserProfileSchema),
  UserControllers.updateUserProfile
);

export const userRoutes = router;
