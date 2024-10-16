/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserControllers } from "./user.controller";
import { UserValidation } from "./user.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "./user.constant";

const router = express.Router();


router.get(
  '/all-users',
  auth(USER_ROLE?.admin), 
  UserControllers.getAllUsers, 
);


router.patch(
  "/update-user/:id",
  auth(USER_ROLE?.customer, USER_ROLE?.admin),
  // upload.single('file'),
  validateRequest(UserValidation.updateUserValidation),
  UserControllers.updateAUser
);

export const userRoutes = router;
