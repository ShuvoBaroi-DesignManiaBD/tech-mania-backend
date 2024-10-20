import mongoose from 'mongoose';
import DataNotFoundError from '../../errors/DataNotFoundError';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { Post } from './post.model';
import { IPost, TPostKeys, TPostUpdateKeys } from './post.interface';
import PostsQueryBuilder from '../../builder/PostsQueryBuilder';
import { postSearchableFields } from './post.constant';
import { Request } from 'express';

const createPost = async (payload: IPost) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const createPost = await Post.create([payload], { session });
    console.log(createPost);

    await session.commitTransaction();
    await session.endSession();
    return (createPost[0] as any)?._doc; // Return the created post document
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error.message || 'Error creating post');
  }
};

const getAllPosts = async (req: Request, query: Record<string, unknown>) => {
  // Create the query using the query builder for filtering, sorting, etc.
  let postQuery;
  let totalMatchingDocuments;
  if (req?.user?.role === 'admin') {
    postQuery = new PostsQueryBuilder(
      Post.find().populate('author', 'name email profilePicture verified'),
      query,
    )
      .search(postSearchableFields)
      .filter()
      .sort()
      .fields();
    
    totalMatchingDocuments = await Post.countDocuments();
  } else {
    postQuery = new PostsQueryBuilder(
      Post.find({ isDeleted: false, isBlocked: false, premium: false }).populate(
        'author',
        'name email profilePicture verified',
      ),
      query,
    )
      .search(postSearchableFields)
      .filter()
      .sort()
      .fields();
    
    totalMatchingDocuments = await Post.countDocuments({ isDeleted: false, isBlocked: false, premium: false });
  }

  postQuery.paginate();
  const posts = await postQuery.modelQuery.exec();

  if (!posts || posts.length < 1) {
    throw new DataNotFoundError();
  }

  return { posts, totalPosts: totalMatchingDocuments };
};

// const getCommentsOfAPost = async (req: Request, id: Record<string, unknown>) => {
//   const post = await Post.findById(id);

//   if (!post || post?.isDeleted || post?.isBlocked) {
//     throw new DataNotFoundError();
//   }

//   const comments = await Post.findById(id).select('comments').populate('comments');

//   return { posts, totalPosts: totalMatchingDocuments };
// };

const getPremiumPosts = async (req: Request, query: Record<string, unknown>) => {
  // Create the query using the query builder for filtering, sorting, etc.
  let postQuery;
  if (req?.user?.role === 'admin' || req?.user?.verified === true) {
    postQuery = new PostsQueryBuilder(
      Post.find({ premium: true }).populate('author', 'name email profilePicture verified'),
      query,
    )
      .search(postSearchableFields)
      .filter()
      .sort()
      .fields();
  } else {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'You are not a verified user!',
    )
  }

  const countQuery = postQuery.modelQuery.clone();
  const totalMatchingDocuments = await countQuery.countDocuments().exec();

  postQuery.paginate();
  const posts = await postQuery.modelQuery.exec();

  if (!posts || posts.length < 1) {
    throw new DataNotFoundError();
  }

  return { posts, totalPosts: totalMatchingDocuments };
};

const updateAPost = async (id: string, payload: Partial<IPost>) => {
  const post = await Post.findById(id);

  if (!post) {
    throw new DataNotFoundError();
  }

  // Validate fields to update
  for (const key of Object.keys(payload)) {
    if (!TPostKeys.includes(key)) {
      throw new AppError(httpStatus.BAD_REQUEST, `Invalid field: ${key}`);
    }
  }

  // Perform the update
  const updateQuery = buildUpdateQuery(payload);
  const updatedPost = await Post.findByIdAndUpdate(
    id,
    { $set: updateQuery },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedPost) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to update the post!',
    );
  }

  return updatedPost;
};

const updateAPostContent = async (
  req: Request,
  id: string,
  payload: Partial<IPost>,
) => {
  const post = await Post.findById(id);
  const userId = req?.user?._id;

  if (
    userId ===
    (
      post?.author as
        | {
            _id: string;
            name: string;
            email: string;
            profilePicture: string;
            verified: boolean;
          }
        | undefined
    )?._id
  ) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'You are not authorized to perform this action!',
    );
  }

  if (!post) {
    throw new DataNotFoundError();
  }

  // Check if payload fields are valid
  for (const key of Object.keys(payload)) {
    if (!TPostUpdateKeys.includes(key)) {
      throw new AppError(httpStatus.BAD_REQUEST, `Invalid field: ${key}`);
    }
  }

  const updateQuery = buildUpdateQuery(payload);
  const updatedPost = await Post.findByIdAndUpdate(
    id,
    { $set: updateQuery },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedPost) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to update the post content!',
    );
  }

  return updatedPost;
};

const addOrRemoveUpvote = async (req: Request, id: string) => {
  const userId = req?.user?._id;
  const post = await Post.findById(id);

  if (!post) {
    throw new DataNotFoundError();
  }

  let result;
  if (post?.upvotes?.includes(userId)) {
    // Remove the upvote (pull the userId from the upvotes array)
    result = await Post.findByIdAndUpdate(
      id,
      { $pull: { upvotes: userId } },
      { new: true, runValidators: true }
    );
  } else {
    // Add the upvote (push the userId to the upvotes array)
    result = await Post.findByIdAndUpdate(
      id,
      {
        $push: { upvotes: userId },
        $pull: { downvotes: userId }, // Optionally remove downvote if exists
      },
      { new: true, runValidators: true }
    );
  }

  return result;
};


const addOrRemoveDownvote = async (req: Request, id: string) => {
  const userId = req?.user?._id;
  const post = await Post.findById(id);

  if (!post) {
    throw new DataNotFoundError();
  }

  let result;
  if (post?.downvotes?.includes(userId)) {
    // Remove the downvote (pull the userId from the downvotes array)
    result = await Post.findByIdAndUpdate(
      id,
      { $pull: { downvotes: userId } },
      { new: true, runValidators: true }
    );
  } else {
    // Add the downvote (push the userId to the downvotes array)
    result = await Post.findByIdAndUpdate(
      id,
      {
        $push: { downvotes: userId },
        $pull: { upvotes: userId }, // Optionally remove upvote if exists
      },
      { new: true, runValidators: true }
    );
  }

  return result;
};


// Helper function to construct the update query
const buildUpdateQuery = (payload: Partial<IPost>) => {
  const updateQuery: any = {};
  for (const [key, value] of Object.entries(payload)) {
    if (typeof value === 'object' && value !== null) {
      for (const [nestedKey, nestedValue] of Object.entries(value)) {
        if (nestedValue !== undefined) {
          updateQuery[`${key}.${nestedKey}`] = nestedValue;
        }
      }
    } else if (value !== undefined) {
      updateQuery[key] = value;
    }
  }
  return updateQuery;
};

export const PostServices = {
  createPost,
  getAllPosts,
  getPremiumPosts,
  updateAPost,
  updateAPostContent,
  addOrRemoveUpvote,
  addOrRemoveDownvote
};
