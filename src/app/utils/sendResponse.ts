import { Response } from 'express';

type TMeta = {
  limit: number;
  page: number;
  total: number;
  totalPage: number;
};

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  meta?: TMeta;
  totalPosts?: number;
  totalUsers?: number;
  totalComments?: number;
  totalVotes?: number;
  data: T;
  token?: string;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data?.statusCode).json({
    success: data.success,
    message: data.message,
    meta: data.meta,
    totalPosts: data.totalPosts,
    totalUsers: data.totalUsers,
    totalComments: data.totalComments,
    totalVotes: data.totalVotes,
    data: data.data,
    token: data.token,
  });
};

export default sendResponse;
