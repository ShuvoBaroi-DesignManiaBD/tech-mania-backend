/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { NextFunction, Request, Response } from 'express';
import { VoteControllers } from './vote.controller';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { post } from 'request';
import { VoteValidation } from './vote.validation';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post(
  '/add-upvote',
  auth(USER_ROLE?.ADMIN, USER_ROLE?.USER),
  validateRequest(VoteValidation.voteValidateSchema),
  VoteControllers.addUpvote,
);

router.post(
  '/add-downvote',
  auth(USER_ROLE?.ADMIN, USER_ROLE?.USER),
  validateRequest(VoteValidation.voteValidateSchema),
  VoteControllers.addDownvote,
);

router.post(
  '/get-post-votes/:postId',
  auth(USER_ROLE?.ADMIN, USER_ROLE?.USER),
  VoteControllers.getAllVotesOfAPost,
);

router.post(
  '/get-comment-votes/:commentId',
  auth(USER_ROLE?.ADMIN, USER_ROLE?.USER),
  VoteControllers.getAllVotesOfAComment,
);

router.post(
  '/get-upvotes',
  auth(USER_ROLE?.ADMIN, USER_ROLE?.USER),
  VoteControllers.getAllUpvotes,
);

router.post(
  '/get-downvotes',
  auth(USER_ROLE?.ADMIN, USER_ROLE?.USER),
  VoteControllers.getAllDownvotes,
);

export const voteRoutes = router;
