/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import { User } from './user.model';
import DataNotFoundError from '../../errors/DataNotFoundError';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { UserSearchableFields } from './user.constant';
import UsersQueryBuilder from '../../builder/UsersQueryBuilder';
import {
  IUpdateProfile,
  IUser,
  TUserKeys,
  TUserProfileKeys,
} from './user.interface';
import { Request } from 'express';
import { Post } from '../Post/post.model';
import decodeToken from '../../utils/verifyToken';

const createUser = async (payload: IUser) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // payload.role = 'user';
    const createUser = await User.create(payload);
    await session.commitTransaction();
    await session.endSession();
    return (createUser as any)?._doc;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};

const getAUser = async (req:Request, id: string) => {

  let user = await User.findById(id);
  let postsByUser = await Post.countDocuments({author: id});

  console.log(user);
  
  if (!user || user.isDeleted) {
    throw new DataNotFoundError();
  }

  if (user.isBlocked) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user account is blocked !');
  }

  const resultForAdmin = {...user, numberOfPosts:postsByUser};
  if(req?.user?.role === 'admin') return resultForAdmin;
  
  user = await User.findById(id).select('-password -isBlocked -isDeleted -paymentInfo');
  const resultForUser = {...(user as any)?._doc, numberOfPosts:postsByUser};
  return resultForUser;
};

const getAllUsers = async (query: Record<string, unknown>) => {
  console.log(query);

  // Create the query builder
  const userQuery = new UsersQueryBuilder(User.find(), query)
    .search()
    .filter()
    .sort()
    .fields();

  // Clone the query for counting documents
  const countQuery = userQuery.modelQuery.clone();
  const totalMatchingDocuments = await countQuery.countDocuments().exec();
  // Execute the query to get the actual results
  userQuery.paginate();
  const users = await userQuery.modelQuery.exec();
  // Handle case where no orders are found
  if (!users || users.length < 1) {
    throw new DataNotFoundError();
  }

  return { users: users, totalUsers: totalMatchingDocuments };
};

const getOtherUsers = async (query: Record<string, unknown>) => {
  console.log("Query parameters:", query);

  // Convert `query.id` to an ObjectId if it's a string
  const excludeId = typeof query.id === "string" ? new mongoose.Types.ObjectId(query.id) : query.id;

  const { id, ...restQuery } = query;
  // Initialize the query builder with modified _id condition
  const userQuery = new UsersQueryBuilder(
    User.find({ isBlocked: false, isDeleted: false, _id: { $ne: excludeId } }),
    restQuery
  )
    .search()
    .filter()
    .sort()
    .fields();

  // Clone the query before applying pagination to get the total count
  const countQuery = userQuery.modelQuery.clone();
  const totalMatchingDocuments = await countQuery.countDocuments().exec();

  // Apply pagination to the main query
  userQuery.paginate();

  // Execute the query to retrieve users
  const users = await userQuery.modelQuery.exec();

  // Debugging output
  // console.log("User Query After Pagination:", userQuery);
  // console.log("Users Retrieved:", users);

  // If no users are found, throw a DataNotFoundError
  if (!users || users.length < 1) {
    throw new DataNotFoundError();
  }

  return { users, totalUsers: totalMatchingDocuments };
};

// ======================= Update operations =======================
const updateAUser = async (id: string, payload: Partial<IUser>) => {
  console.log(id, payload);

  // Finding the user by ID
  const user = await User.findById(id);

  if (!user) {
    throw new DataNotFoundError();
  }

  // Check for invalid fields in the payload
  for (const key of Object.keys(payload)) {
    if (!TUserKeys.includes(key)) {
      throw new AppError(httpStatus.BAD_REQUEST, `Invalid field: ${key}`);
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
  console.log('query ===>',updateQuery);
  
  // Perform the update with $set to modify only the specified fields
  const result = await User.findByIdAndUpdate(
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
      'Failed to update the user!',
    );
  }

  return result;
};

const updateAUserProfile = async (id: string, payload: IUpdateProfile) => {
  console.log(id, payload);

  // Finding the user by ID
  const user = await User.findById(id);

  if (!user) {
    throw new DataNotFoundError();
  }

  // Check for invalid fields in the payload
  for (const key of Object.keys(payload)) {
    if (!TUserProfileKeys.includes(key)) {
      throw new AppError(httpStatus.BAD_REQUEST, `Invalid field: ${key}`);
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

  console.log('query ===>',updateQuery);
  // Perform the update with $set to modify only the specified fields
  const result = await User.findByIdAndUpdate(
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
      'Failed to update the user!',
    );
  }

  return result;
};

const followAUser = async (req: Request, id: string) => {
  const decode = decodeToken(req);
  const userId = decode?.id;
  console.log(userId);
  
  if (!userId) {
    throw new Error("User not authenticated");
  }

  // Find the user to be followed
  const userToFollow = await User.findById(id);
  if (!userToFollow) {
    throw new DataNotFoundError();
  }

  // Update the following list of the requesting user
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $addToSet: { following: id } }, // Use $addToSet to avoid duplicates
    { new: true }
  );

  // Update the followers list of the user being followed
  await User.findByIdAndUpdate(
    id,
    { $addToSet: { followers: userId } }, // Use $addToSet to avoid duplicates
    { new: true }
  );

  return updatedUser;
};


const unFollowAUser = async (req: Request, id: string) => {
  const decode = decodeToken(req);
  const userId = decode?.id;
  console.log(userId);
  if (!userId) {
    throw new Error("User not authenticated");
  }

  // Convert both IDs to ObjectId to ensure type consistency
  const targetUserId = new mongoose.Types.ObjectId(id);
  const requestingUserId = new mongoose.Types.ObjectId(userId);

  console.log('objectIds ====>',targetUserId, requestingUserId);
  
  // Remove the target user from the following list of the requesting user
  const updatedUser = await User.findByIdAndUpdate(
    requestingUserId,
    { $pull: { following: targetUserId } }, // Pull the ObjectId from following array
    { new: true }
  );

  // Remove the requesting user from the followers list of the user being unfollowed
  await User.findByIdAndUpdate(
    targetUserId,
    { $pull: { followers: requestingUserId } }, // Pull the ObjectId from followers array
    { new: true }
  );

  return updatedUser;
};


const addFollower = async (req: Request, id: string) => {
  const userId = req?.user?._id;
  const user = await User.findById(id);
  if (!user) {
    throw new DataNotFoundError();
  }
  const follower = await User.findByIdAndUpdate({followers: {$push: [id]}}, userId, {
    new: true,});
  return follower;
};

export const UserServices = {
  createUser,
  getAUser,
  getAllUsers,
  updateAUser,
  updateAUserProfile,
  getOtherUsers,
  followAUser,
  unFollowAUser,
  addFollower
};
