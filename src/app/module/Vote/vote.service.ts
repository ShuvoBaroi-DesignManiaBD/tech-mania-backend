import mongoose from 'mongoose';
import DataNotFoundError from '../../errors/DataNotFoundError';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { Request } from 'express';
import { Vote } from './vote.model';
import { TVote, TVoteType } from './vote.interface';
import { VOTE_TYPE } from './vote.constant';
import { Post } from '../Post/post.model';
import { Comment } from '../Comment/comment.model';
const { ObjectId } = mongoose.Types;

const addUpvote = async (payload: TVote) => {
  try {
    const isAlreadyUpvoted = await Vote.findOne({
      userId: payload.userId,
      parentId: payload.parentId,
      type: VOTE_TYPE.UPVOTE,
    });

    if (isAlreadyUpvoted) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Already upvoted');
    }

    const removeDownvote = await Vote.findOneAndDelete(
      {
        parentId: payload?.parentId,
        type: VOTE_TYPE.DOWNVOTE,
      },
      { new: true },
    );

    let addVote;
    addVote = await Vote.create(payload, { new: true });
    console.log(addVote);

    return (addVote as any)?._doc; // Return the created post document
  } catch (error: any) {
    throw new Error(error.message || 'Error adding upvote');
  }
};


const addDownvote = async (payload: TVote) => {
  try {
    // Ensure payload IDs are ObjectId
    const parentId = new ObjectId(payload.parentId.toString());
    const userId = new ObjectId(payload.userId.toString());

    console.log('parentId:', parentId);
    console.log('userId:', userId);
    console.log('parentType:', payload.parentType);

    // Check if the post is already downvoted by the user
    const isAlreadyDownvoted = await Vote.findOne({
      userId,
      parentId,
      parentType: payload.parentType,
      type: VOTE_TYPE.DOWNVOTE,
    });

    console.log('isAlreadyDownvoted:', isAlreadyDownvoted);

    if (isAlreadyDownvoted) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Already downvoted');
    }

    // Remove any existing upvote by the user for the same parent
    const existingUpvote = await Vote.findOne({
      parentId,
      userId,
      parentType: payload.parentType,
      type: VOTE_TYPE.UPVOTE,
    });

    console.log('Existing upvote:', existingUpvote);

    if (existingUpvote) {
      const removedUpvote = await Vote.deleteOne({ _id: existingUpvote._id });
      // Log the result of the delete operation
      console.log('Removed upvote:', removedUpvote);
      if (removedUpvote.deletedCount === 0) {
        console.log('No upvote was deleted. Check if the query was correct.');
      }
    } else {
      console.log('No existing upvote found');
    }

    // Add the downvote
    const addDownvote = await Vote.create(payload);
    console.log('Added downvote:', addDownvote);

    return addDownvote; // Return the created downvote document
  } catch (error: any) {
    throw new Error(error.message || 'Error adding downvote');
  }
};


const getUpvotes = async (req: Request, parentId: string) => {
  // Create the query using the query builder for filtering, sorting, etc.
  const upvotes = await Vote.find({
    parentId: parentId,
    type: VOTE_TYPE.UPVOTE,
  });
  if (!upvotes || upvotes.length < 1) {
    throw new DataNotFoundError();
  }
  const numberOfUpvotes = upvotes?.length;

  return { upvotes, totalUpVotes: numberOfUpvotes };
};

const getDownvotes = async (req: Request, parentId: string) => {
  // Create the query using the query builder for filtering, sorting, etc.
  const downvotes = await Vote.find({
    parentId: parentId,
    type: VOTE_TYPE.DOWNVOTE,
  });
  if (!downvotes || downvotes.length < 1) {
    throw new DataNotFoundError();
  }
  const numberOfDownvotes = downvotes?.length;

  return { downvotes: downvotes, totalUpVotes: numberOfDownvotes };
};

const getAllVotesOfAPost = async (req: Request, postId: string) => {
  const isPostExists = await Post.findById(postId);
  if (!isPostExists) {
    throw new DataNotFoundError();
  }

  let votes = {};

  const upvotes = await Vote.countDocuments({
    parentId: postId,
    type: VOTE_TYPE.UPVOTE,
  });
  // Create the query using the query builder for filtering, sorting, etc.
  const downvotes = await Vote.countDocuments({
    parentId: postId,
    type: VOTE_TYPE.DOWNVOTE,
  });

  votes = {
    upvotes,
    downvotes,
  };

  return votes;
};

const getAllVotesOfAComment = async (req: Request, commentId: string) => {
  const isCommentExists = await Comment.findById(commentId);
  if (!isCommentExists) {
    throw new DataNotFoundError();
  }

  let votes = {};

  const upvotes = await Vote.countDocuments({
    parentId: commentId,
    type: VOTE_TYPE.UPVOTE,
  });
  // Create the query using the query builder for filtering, sorting, etc.
  const downvotes = await Vote.countDocuments({
    parentId: commentId,
    type: VOTE_TYPE.DOWNVOTE,
  });

  votes = {
    upvotes,
    downvotes,
  };

  return votes;
};

export const VoteServices = {
  getUpvotes,
  getDownvotes,
  getAllVotesOfAPost,
  getAllVotesOfAComment,
  addUpvote,
  addDownvote,
};
