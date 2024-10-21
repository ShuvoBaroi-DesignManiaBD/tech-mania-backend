/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import DataNotFoundError from '../../errors/DataNotFoundError';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import UsersQueryBuilder from '../../builder/UsersQueryBuilder';
import {
  IComment,
  IReply,
  IUpdateComment,
  TCommentUpdateKeysForUser,
} from './comment.interface';
import { Comment } from './comment.model';
import PostsQueryBuilder from '../../builder/PostsQueryBuilder';
import { Request } from 'express';
import QueryBuilder from '../../builder/QueryBuilder';
import CommentsQueryBuilder from '../../builder/CommentsQueryBuilder';

const createComment = async (payload: IComment) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // payload.role = 'user';
    const newComment = await Comment.create(payload);
    await session.commitTransaction();
    await session.endSession();
    return (newComment as any)?._doc;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};


const getAllCommentsOfAPost = async (req:Request,postId: string, query: Record<string, unknown>) => {
  console.log(postId);
  
  // Add postId to the query object
  const extendedQuery = { ...query, postId };
  // const comments = await Comment.find({postId: postId})
  const commentQuery = new CommentsQueryBuilder(Comment.find({postId: postId}).populate('author', '_id name email profilePicture verified'), query)
    .search(['content'])             // Apply search to the 'content' field
    .filter()                        // Apply any filters passed in the query
    .sort()                          // Apply sorting
    .fields()                        // Select only specific fields
    .paginate();                     // Apply pagination

  const comments = await commentQuery.modelQuery.exec();

  console.log(postId, commentQuery, comments);
  
  if (!comments || comments.length < 1) {
    throw new DataNotFoundError();
  }

  return comments;
};


const getAComment = async (req: Request, id: string) => {
  const commentId = req?.query?.id as string;
  // Create the query builder
  const comment = await Comment.findById(commentId).populate('replies');
  if (!comment) {
    throw new DataNotFoundError();
  }
  return comment;
};

// ======================= Update operations =======================
const updateAComment = async (
  req: Request,
  id: string,
  payload: Partial<IUpdateComment>,
) => {
  const userId = req?.user?.id;
  const comment = await Comment.findById(id);

  if (userId !== comment?.author) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
  }
  // Finding the user by ID

  if (!comment) {
    throw new DataNotFoundError();
  }

  // Check for invalid fields in the payload
  if (req?.user?.role !== 'admin') {
    for (const key of Object.keys(payload)) {
      if (!TCommentUpdateKeysForUser.includes(key)) {
        throw new AppError(httpStatus.BAD_REQUEST, `Invalid field: ${key}`);
      }
    }
  }

  // Construct the update query with $set
  const updateQuery: any = {};
  for (const [key, value] of Object.entries(payload)) {
    if (typeof value === 'object' && value !== null) {
      // Handle nested objects like 'address'
      for (const [nestedKey, nestedValue] of Object.entries(value)) {
        if (nestedValue !== undefined) {
          updateQuery[`${key}.${nestedKey}`] = nestedValue;
        }
      }
    } else if (value !== undefined) {
      // Handle top-level fields
      updateQuery[key] = value;
    }
  }

  // Perform the update with $set to modify only the specified fields
  const result = await Comment.findByIdAndUpdate(
    id,
    { $set: updateQuery },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!result) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to update the comment!',
    );
  }

  return result;
};

const deleteAComment = async (
  req: Request,
  id: string,
) => {
  console.log(id);
  const userId = req?.user?.id;
  const comment = await Comment.findById(id);

  if (userId !== comment?.author) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
  }
  // Finding the user by ID

  if (!comment) {
    throw new DataNotFoundError();
  }


  // Perform the update with $set to modify only the specified fields
  const result = await Comment.findByIdAndUpdate(
    id,
    { $set: { isDeleted: true } },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!result) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to delete the comment!',
    );
  }

  return result;
};


// ======================= Reply services =======================

const getAllReplies = async (id: string) => {
  const comment = await Comment.findById(id);
  if (!comment) {
    throw new DataNotFoundError();
  }
  const replies = await comment.populate('replies');
  // Create the query builder

  return replies;
};

const addReply = async (payload: IReply) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // payload.role = 'user';
    const newComment = await Comment.create(payload);
    await session.commitTransaction();
    await session.endSession();
    return (newComment as any)?._doc;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};

const updateAReply = async (
  req: Request,
  id: string,
  payload: Partial<IUpdateComment>,
) => {
  console.log(id, payload);
  const userId = req?.user?.id;
  const reply = await Comment.findById(id);

  if (userId !== reply?.author) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
  }
  // Finding the user by ID

  if (!reply) {
    throw new DataNotFoundError();
  }

  // Check for invalid fields in the payload
  if (req?.user?.role !== 'admin') {
    for (const key of Object.keys(payload)) {
      if (!TCommentUpdateKeysForUser.includes(key)) {
        throw new AppError(httpStatus.BAD_REQUEST, `Invalid field: ${key}`);
      }
    }
  }

  // Construct the update query with $set
  const updateQuery: any = {};
  for (const [key, value] of Object.entries(payload)) {
    if (typeof value === 'object' && value !== null) {
      // Handle nested objects like 'address'
      for (const [nestedKey, nestedValue] of Object.entries(value)) {
        if (nestedValue !== undefined) {
          updateQuery[`${key}.${nestedKey}`] = nestedValue;
        }
      }
    } else if (value !== undefined) {
      // Handle top-level fields
      updateQuery[key] = value;
    }
  }

  // Perform the update with $set to modify only the specified fields
  const result = await Comment.findByIdAndUpdate(
    id,
    { $set: updateQuery },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!result) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to update the reply!',
    );
  }

  return result;
};

const deleteAReply = async (
  req: Request,
  id: string,
) => {
  console.log(id);
  const userId = req?.user?.id;
  const reply = await Comment.findById(id);

  if (userId !== reply?.author) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
  }
  // Finding the user by ID

  if (!reply) {
    throw new DataNotFoundError();
  }


  // Perform the update with $set to modify only the specified fields
  const result = await Comment.findByIdAndUpdate(
    id,
    { $set: { isDeleted: true } },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!result) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to delete the reply!',
    );
  }

  return result;
};

export const CommentServices = {
  createComment,
  getAllCommentsOfAPost,
  getAComment,
  updateAComment,
  deleteAComment,
  getAllReplies,
  updateAReply,
  addReply,
  deleteAReply
};
