import { z } from 'zod';
import { paymentInfoValidationSchema } from '../Payment/payment.validation';

// Zod schema for user role
export const userRoleSchema = z.enum(['user', 'admin']);

// Zod schema for creating/updating followers and following (list of user IDs)
export const userIdArraySchema = z.array(z.string()).optional();

// Zod schema for posts (list of post IDs)
export const postIdArraySchema = z.array(z.string()).optional();

// Zod schema for user creation
export const newUserSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    profilePicture: z.string().optional(),
    verified: z.boolean().default(false),
    isDeleted: z.boolean().default(false),
    isBlocked: z.boolean().default(false),
    role: z.literal('user').default('user'),
    followers: userIdArraySchema,
    following: userIdArraySchema,
    posts: postIdArraySchema,
    paymentInfo: paymentInfoValidationSchema.optional(),
  }),
});

// Zod schema for updating user profile
export const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email('Invalid email address').optional(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .optional(),
  phone: z.string().optional(),
  profilePicture: z.string().optional(),
  verified: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
  isBlocked: z.boolean().optional(),
  role: userRoleSchema.optional(),
  followers: userIdArraySchema.optional(),
  following: userIdArraySchema.optional(),
  posts: postIdArraySchema.optional(),
  paymentInfo: paymentInfoValidationSchema.optional(),
});

// Zod schema for updating user profile
export const updateUserProfileSchema = z.object({
  name: z.string().optional(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .optional(),
  phone: z.string().optional(),
  profilePicture: z.string().optional(),
});

// Zod schema for user login
export const loginUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const UserValidation = {
  userRoleSchema,
  newUserSchema,
  updateUserSchema,
  updateUserProfileSchema,
  loginUserSchema,
};
