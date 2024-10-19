import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { Request, Response } from 'express';
import sendResponse from '../../utils/sendResponse';
import { PostServices } from './post.service';


// Below you can see the application of catchAsync function. 
const createPost = catchAsync(async (req:Request, res:Response) => {
  // Below is the sample code to show you how to call the service function and pass parameter to it. 
  const result = await PostServices.createPost(req.body);

  // Below you can see the use of custom sendResponse function to make the code base clean. 
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Post created succesfully',
    data: result,
  });
})


const getAllPosts = catchAsync(async (req: Request, res: Response) => {
  const {posts, totalPosts} = await PostServices.getAllPosts(req,req?.query);
  
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All posts retrieved successfully",
    totalPosts: totalPosts,
    data: posts,
  });
});

const getPremiumPosts = catchAsync(async (req: Request, res: Response) => {
  const {posts, totalPosts} = await PostServices.getPremiumPosts(req,req?.query);
  
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All posts retrieved successfully",
    totalPosts: totalPosts,
    data: posts,
  });
});


const updateAPost = catchAsync(async (req: Request, res: Response) => {
  const result = await PostServices.updateAPost(req?.params?.id, req?.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Post updated successfully",
    data: result,
  });
});

const updateAPostContent = catchAsync(async (req: Request, res: Response) => {
  const result = await PostServices.updateAPostContent(req, req?.params?.id, req?.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Post content updated successfully",
    data: result,
  });
});


export const UserControllers = {
  createPost,
  getAllPosts,
  getPremiumPosts,
  updateAPost,
  updateAPostContent
 };