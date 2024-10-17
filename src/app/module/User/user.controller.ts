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


const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const {users, totalUsers} = await UserServices.getAllUsers(req?.query);
  
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All users retrieved successfully",
    totalOrders: totalUsers,
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

const updateUserProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.updateAUserProfile(req?.params?.id, req?.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User profile updated successfully",
    data: result,
  });
});


export const UserControllers = {
  createUser,
  getAllUsers,
  updateAUser,
  updateUserProfile
 };