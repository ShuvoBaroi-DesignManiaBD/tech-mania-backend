/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { authServices } from './auth.service';
import config from '../../config';

// const signUp = catchAsync(async (req: Request, res: Response) => {
//   const result = await authServices.signUp(req.body);
//   // eslint-disable-next-line no-unsafe-optional-chaining
//   const {password, ...resultExcludingpassword} = result;

//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.CREATED,
//     message: 'User registered successfully',
//     data: resultExcludingpassword,
//   });
// });

const signIn = catchAsync(async (req, res) => {
  const result = await authServices.signIn(req.body);
  // eslint-disable-next-line no-unsafe-optional-chaining
  const {password, ...resultExcludingpassword} = result.user;
  const { refreshToken, accessToken } = result;
  const isProduction = config.node_env === 'production';

  res.cookie('refreshToken', refreshToken, {
    secure: isProduction,
    httpOnly: true,
    sameSite: isProduction ? 'none' :  'lax',
    // sameSite: 'none'
  });

  res.cookie('accessToken', accessToken, {
    secure: isProduction,
    httpOnly: true,
    sameSite: isProduction ? 'none' :  'lax',
    // sameSite: 'none'
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is logged in succesfully!',
    data: resultExcludingpassword,
    token: accessToken,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req?.cookies;
  console.log('refreshToken =>', refreshToken);
  
  const result = await authServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token is retrieved succesfully!',
    data: result,
  });
});

export const authControllers = {
  signIn,
  refreshToken
};
