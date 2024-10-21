/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { NextFunction, Request, Response } from 'express';
import { commentValidation } from './comment.validation';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CommentControllers } from './comment.controller';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.get(
  '/post/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  CommentControllers.getAllCommentsOfAPost,
);

router.post(
  '/create-comment',
  validateRequest(commentValidation.commentCreationSchema),
  CommentControllers.createComment,
);

router.get(
  '/comment/:id',
  auth(USER_ROLE?.ADMIN, USER_ROLE?.USER),
  CommentControllers.getAComment,
);

router.patch(
  '/comment/:id',
  auth(USER_ROLE?.ADMIN, USER_ROLE?.USER),
  validateRequest(commentValidation.updateCommentSchema),
  CommentControllers.updateAComment,
);

router.get(
  '/comment-replies/:id',
  auth(USER_ROLE?.USER, USER_ROLE?.ADMIN),
  CommentControllers.getAllReplies,
);

router.post(
  '/add-reply',
  auth(USER_ROLE?.USER, USER_ROLE?.ADMIN),
  CommentControllers.addReply,
);

router.patch(
  '/update-reply/:id',
  auth(USER_ROLE?.USER, USER_ROLE?.ADMIN),
  validateRequest(commentValidation.updateCommentSchema),
  CommentControllers.updateReply,
);

router.patch(
  '/delete-reply/:id',
  auth(USER_ROLE?.USER, USER_ROLE?.ADMIN),
  validateRequest(commentValidation.updateCommentSchema),
  CommentControllers.deleteReply,
);

export const commentRoutes = router;
