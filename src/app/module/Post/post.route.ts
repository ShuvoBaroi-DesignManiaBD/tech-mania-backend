/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { NextFunction, Request, Response } from 'express';
import { PostControllers } from './post.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './post.constant';
import validateRequest from '../../middlewares/validateRequest';
import { post } from 'request';
import { PostValidation } from './post.validation';

const router = express.Router();

router.get(
  '/all-posts',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  PostControllers.getAllPosts,
);

router.get(
  '/post-interactions/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  PostControllers.getAPostInteractions,
);

router.get(
  '/user-posts/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  PostControllers.getALlPostsOfAUser,
);

router.get(
  '/premium-posts',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  PostControllers.getPremiumPosts,
);

router.post(
  '/create-post',
  auth(USER_ROLE?.ADMIN, USER_ROLE?.USER),
  validateRequest(PostValidation.postSchema),
  PostControllers.createPost,
);

router.patch(
  '/update-post/:id',
  auth(USER_ROLE?.ADMIN),
  validateRequest(PostValidation.postUpdateSchema),
  PostControllers.updateAPost,
);

router.patch(
  '/update-upvote/:id',
  auth(USER_ROLE?.ADMIN, USER_ROLE?.USER),
  validateRequest(PostValidation.postUpdateSchema),
  PostControllers.addOrRemoveUpvote,
);

router.patch(
  '/update-downvote/:id',
  auth(USER_ROLE?.ADMIN, USER_ROLE?.USER),
  validateRequest(PostValidation.postUpdateSchema),
  PostControllers.addOrRemoveDownvote,
);

router.patch(
  '/update-post-content/:id',
  auth(USER_ROLE?.ADMIN, USER_ROLE?.USER),
  validateRequest(PostValidation.postContentUpdateSchema),
  PostControllers.updateAPostContent,
);

router.patch(
  '/delete-post',
  auth(USER_ROLE?.ADMIN, USER_ROLE?.USER),
  PostControllers.deleteAPost,
);

export const postRoutes = router;
