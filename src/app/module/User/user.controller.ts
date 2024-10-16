import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { UserServices } from './user.service';
import { Request, Response } from 'express';
import sendResponse from '../../utils/sendResponse';


const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const {users, totalUsers} = await UserServices.getAllUsers(req?.query);
  
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All orders retrieved successfully",
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


export const UserControllers = {
  getAllUsers,
  updateAUser
 };