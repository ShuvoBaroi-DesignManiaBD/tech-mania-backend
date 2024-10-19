/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { NextFunction, Request, Response } from 'express';
import { UserControllers } from './post.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './post.constant';
import validateRequest from '../../middlewares/validateRequest';
import { post } from 'request';
import { PostValidation } from './post.validation';

const router = express.Router();

router.get('/all-posts', auth(USER_ROLE.ADMIN, USER_ROLE.USER), UserControllers.getAllPosts);
router.get('/premium-posts', auth(USER_ROLE.ADMIN, USER_ROLE.USER), UserControllers.getPremiumPosts);

router.post(
  '/create-post',
  auth(USER_ROLE?.ADMIN, USER_ROLE?.USER),
  validateRequest(PostValidation.postSchema),
  UserControllers.createPost,
);

router.patch(
  '/update-post/:id',
  auth(USER_ROLE?.ADMIN),
  validateRequest(PostValidation.postUpdateSchema),
  UserControllers.updateAPost,
);

router.patch(
  '/update-post-content/:id',
  auth(USER_ROLE?.ADMIN, USER_ROLE?.USER),
  validateRequest(PostValidation.postContentUpdateSchema),
  UserControllers.updateAPostContent,
);

router.patch(
  '/delete-post/:id',
  auth(USER_ROLE?.USER, USER_ROLE?.ADMIN),
  validateRequest(PostValidation.postContentUpdateSchema),
  UserControllers.updateAPostContent,
);

export const postRoutes = router;
