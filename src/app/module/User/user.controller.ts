import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { UserServices } from './user.service';
import { Request, Response } from 'express';
import sendResponse from '../../utils/sendResponse';


// Below you can see the application of catchAsync function. 
const createUser = catchAsync(async (req:Request, res:Response) => {
  // Below is the sample code to show you how to call the service function and pass parameter to it. 
  const result = await UserServices.createUser(req.body);

  // Below you can see the use of custom sendResponse function to make the code base clean. 
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'User created succesfully',
    data: result,
  });
})


const getAUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getAUser(req, req?.params?.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "A user retrieved successfully",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const {users, totalUsers} = await UserServices.getAllUsers(req?.query);
  
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All users retrieved successfully",
    totalUsers: totalUsers,
    data: users,
  });
});

const getOtherUsers = catchAsync(async (req: Request, res: Response) => {
  const {users, totalUsers} = await UserServices.getOtherUsers(req?.query);
  
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Suggested users retrieved successfully",
    totalUsers: totalUsers,
    data: users,
  });
});


const updateAUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.updateAUser(req?.params?.id, req?.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User updated successfully",
    data: result,
  });
});

const verifyAUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.verifyAUser(req?.params?.id, req?.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User verified successfully",
    data: result,
  });
});

const updateUserProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.updateAUserProfile(req?.params?.id, req?.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User profile updated successfully",
    data: result,
  });
});

const followAUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.followAUser(req, req?.params?.id);

  sendResponse(res, { 
    success: true,
    statusCode: httpStatus.OK,
    message: "User followed successfully",
    data: result,
  });
});

const unFollowAUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.unFollowAUser(req, req?.params?.id);

  sendResponse(res, { 
    success: true,
    statusCode: httpStatus.OK,
    message: "User unfollowed successfully",
    data: result,
  });
});

const addFollower = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.followAUser(req, req?.params?.id);

  sendResponse(res, { 
    success: true,
    statusCode: httpStatus.OK,
    message: "A new follower added successfully",
    data: result,
  });
});


export const UserControllers = {
  createUser,
  getAUser,
  getAllUsers,
  getOtherUsers,
  updateAUser,
  verifyAUser,
  updateUserProfile,
  followAUser,
  unFollowAUser,
  addFollower
 };