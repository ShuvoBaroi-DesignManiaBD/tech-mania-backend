/* eslint-disable no-unused-vars */
import { Document, Model } from 'mongoose';
import { USER_ROLE } from './user.constant';
import { TPaymentInfo } from '../Payment/payment.interface';

export type TUserRole = 'user' | 'admin';

export interface IUser extends Document {
  name: string;
  username: string;
  email: string;
  phone?: string;
  password: string;
  bio?: string;
  profilePicture?: string;
  verified: boolean;
  postCredit: number;
  followCredit: number;
  isDeleted: boolean;
  isBlocked: boolean;
  role: TUserRole;
  followers?: string[]; // List of follower IDs
  following?: string[]; // List of followed user IDs
  posts?: string[]; // List of user's post IDs
  paymentInfo?: TPaymentInfo;
}

// User profile update
export interface IUpdateProfile {
  name?: string;
  password?: string;
  phone?: string;
  bio?: string;
  profilePicture?: string;
};

export interface IRegisterData {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface UserModel extends Model<IUser> {
  //instance methods for checking if the user exist
  isUserExistsByEmail(email: string): Promise<IUser>;
  isUserExistsById(email: string): Promise<IUser>;
  //instance methods for checking if passwords are matched
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}

// Create an array of TUser keys
export const TUserKeys: string[] = [
  'name',
  'email',
  'phone',
  'password',
  'bio',
  'profilePicture',
  'paymentInfo',
  'role',
  'followers',
  'following',
  'posts',
  'isBlocked',
  'isDeleted',
  'verified',
];
export const TUserProfileKeys: string[] = [
  'name',
  'phone',
  'bio',
  'password',
  'profilePicture',
  'paymentInfo',
];
