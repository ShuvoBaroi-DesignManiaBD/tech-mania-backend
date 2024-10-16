/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import { User } from "./user.model";
import { TUpdateUser, TUser, TUserKeys } from "./user.interface";
import DataNotFoundError from "../../errors/DataNotFoundError";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { UserSearchableFields } from "./user.constant";
import UsersQueryBuilder from "../../builder/UsersQueryBuilder";


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


// ======================= Update operations =======================
const updateAUser = async (id: string, payload: Partial<TUpdateUser>) => {
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

  // Perform the update with $set to modify only the specified fields
  const result = await User.findByIdAndUpdate(id, { $set: updateQuery }, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to update the user!'
    );
  }

  return result;
};


export const UserServices = {
  getAllUsers,
  updateAUser,
}