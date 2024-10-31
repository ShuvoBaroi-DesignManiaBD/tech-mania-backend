import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { Request, Response } from 'express';
import sendResponse from '../../utils/sendResponse';
import { VoteServices } from './vote.service';

// Below you can see the application of catchAsync function.
const addUpvote = catchAsync(async (req: Request, res: Response) => {
  // Below is the sample code to show you how to call the service function and pass parameter to it.
  const result = await VoteServices.addUpvote(req.body);

  // Below you can see the use of custom sendResponse function to make the code base clean.
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Upvote added succesfully',
    data: result,
  });
});

const addDownvote = catchAsync(async (req: Request, res: Response) => {
  console.log('payload=>', req?.body);
  
  // Below is the sample code to show you how to call the service function and pass parameter to it.
  const result = await VoteServices.addDownvote(req?.body);

  // Below you can see the use of custom sendResponse function to make the code base clean.
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Downvote added succesfully',
    data: result,
  });
});

const getAllVotesOfAPost = catchAsync(async (req: Request, res: Response) => {
  const votes = await VoteServices.getAllVotesOfAPost(req, req?.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'All votes of the post retrieved successfully',
    data: votes,
  });
});

const getAllVotesOfAComment = catchAsync(async (req: Request, res: Response) => {
  const votes = await VoteServices.getAllVotesOfAComment(req, req?.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'All votes of the comment retrieved successfully',
    data: votes,
  });
});

const getAllUpvotes = catchAsync(async (req: Request, res: Response) => {
  const { upvotes, totalUpVotes } = await VoteServices.getUpvotes(req, req?.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'All upvotes retrieved successfully',
    totalVotes: totalUpVotes,
    data: upvotes,
  });
});

const getAllDownvotes = catchAsync(async (req: Request, res: Response) => {
  const { upvotes, totalUpVotes } = await VoteServices.getUpvotes(req, req?.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'All downvotes retrieved successfully',
    totalVotes: totalUpVotes,
    data: upvotes,
  });
});


export const VoteControllers = {
  addUpvote,
  addDownvote,
  getAllUpvotes,
  getAllDownvotes,
  getAllVotesOfAPost,
  getAllVotesOfAComment
};
