import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { Request, Response } from 'express';
import sendResponse from '../../utils/sendResponse';
import { CommentServices } from './comment.service';


// Below you can see the application of catchAsync function. 
const createComment = catchAsync(async (req:Request, res:Response) => {
  // Below is the sample code to show you how to call the service function and pass parameter to it. 
  const result = await CommentServices.createComment(req?.body);

  // Below you can see the use of custom sendResponse function to make the code base clean. 
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Comment created succesfully',
    data: result,
  });
})

const addReply = catchAsync(async (req:Request, res:Response) => {
  // Below is the sample code to show you how to call the service function and pass parameter to it. 
  const result = await CommentServices.addReply(req.body);

  // Below you can see the use of custom sendResponse function to make the code base clean. 
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Reply added to the comment succesfully',
    data: result,
  });
})

const updateReply = catchAsync(async (req:Request, res:Response) => {
  // Below is the sample code to show you how to call the service function and pass parameter to it. 
  const result = await CommentServices.updateAReply(req, req?.params?.id, req.body);

  // Below you can see the use of custom sendResponse function to make the code base clean. 
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Reply updated succesfully',
    data: result,
  });
})

const deleteReply = catchAsync(async (req:Request, res:Response) => {
  // Below is the sample code to show you how to call the service function and pass parameter to it. 
  const result = await CommentServices.deleteAReply(req,req?.params?.id);

  // Below you can see the use of custom sendResponse function to make the code base clean. 
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Reply deleted succesfully',
    data: result,
  });
})


const getAllCommentsOfAPost = catchAsync(async (req: Request, res: Response) => {
  const comments = await CommentServices.getAllCommentsOfAPost(req,req?.params?.id,req?.query);
  
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All comments retrieved successfully",
    data: comments,
  });
});

const getAComment = catchAsync(async (req: Request, res: Response) => {
  const comment = await CommentServices.getAComment(req,req?.params?.id);
  
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Comment data retrieved successfully",
    data: comment,
  });
});

const getAllReplies = catchAsync(async (req: Request, res: Response) => {
  const replies = await CommentServices.getAllReplies(req?.params?.id);
  
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All replies of the comment retrieved successfully",
    data: replies,
  });
});


const updateAComment = catchAsync(async (req: Request, res: Response) => {
  const result = await CommentServices.updateAComment(req, req?.params?.id, req?.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Comment updated successfully",
    data: result,
  });
});

const deleteAComment = catchAsync(async (req: Request, res: Response) => {
  const result = await CommentServices.deleteAComment(req, req?.params?.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Comment deleted successfully",
    data: result,
  });
});


export const CommentControllers = {
  createComment,
  addReply,
  updateReply,
  deleteReply,
  updateAComment,
  getAllCommentsOfAPost,
  getAComment,
  getAllReplies,
 };