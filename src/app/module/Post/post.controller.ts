import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { Request, Response } from 'express';
import sendResponse from '../../utils/sendResponse';
import { PostServices } from './post.service';

// Below you can see the application of catchAsync function.
const createPost = catchAsync(async (req: Request, res: Response) => {
  // Below is the sample code to show you how to call the service function and pass parameter to it.
  const result = await PostServices.createPost(req, req.body);

  // Below you can see the use of custom sendResponse function to make the code base clean.
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Post created succesfully',
    data: result,
  });
});

const getAllPosts = catchAsync(async (req: Request, res: Response) => {
  const { posts, totalPosts } = await PostServices.getAllPosts(req, req?.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'All posts retrieved successfully',
    totalPosts: totalPosts,
    data: posts,
  });
});

const getAPost = catchAsync(async (req: Request, res: Response) => {
  const post = await PostServices.getAPost(req, req?.params?.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'The Post retrieved successfully',
    data: post,
  });
});

const getAPostInteractions = catchAsync(async (req: Request, res: Response) => {
  const data = await PostServices.getAPostInterations(req?.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Upvotes, downvotes & comments calculatd successfully of the post',
    data: data,
  });
});

const getALlPostsOfAUser = catchAsync(async (req: Request, res: Response) => {
  const { posts, totalPosts } = await PostServices.userPosts(req, req?.params.id, req?.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'All posts of the user retrieved successfully',
    totalPosts: totalPosts,
    data: posts,
  });
});

const getPremiumPosts = catchAsync(async (req: Request, res: Response) => {
  const { posts, totalPosts } = await PostServices.getPremiumPosts(
    req,
    req?.query,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'All posts retrieved successfully',
    totalPosts: totalPosts,
    data: posts,
  });
});

const updateAPost = catchAsync(async (req: Request, res: Response) => {
  const result = await PostServices.updateAPost(req?.params?.id, req?.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Post updated successfully',
    data: result,
  });
});

const addOrRemoveUpvote = catchAsync(async (req: Request, res: Response) => {
  const result = await PostServices.addOrRemoveUpvote(
    req,
    req?.params?.id,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Upvote updated successfully',
    data: result,
  });
});

const addOrRemoveDownvote = catchAsync(async (req: Request, res: Response) => {
  const result = await PostServices.addOrRemoveDownvote(
    req,
    req?.params?.id,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Downvote updated successfully',
    data: result,
  });
});

const updateAPostContent = catchAsync(async (req: Request, res: Response) => {
  const result = await PostServices.updateAPostContent(
    req,
    req?.params?.id,
    req?.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Post content updated successfully',
    data: result,
  });
});

const deleteAPost = catchAsync(async (req: Request, res: Response) => {
  console.log(req?.body);
  
  const result = await PostServices.deleteAPost(
    req,
    req?.query?.postId as string,
    req?.query?.userId as string
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Post deleted successfully!',
    data: result,
  });
});

export const PostControllers = {
  createPost,
  getAllPosts,
  getAPost,
  getAPostInteractions,
  getALlPostsOfAUser,
  getPremiumPosts,
  updateAPost,
  deleteAPost,
  updateAPostContent,
  addOrRemoveUpvote,
  addOrRemoveDownvote
};
