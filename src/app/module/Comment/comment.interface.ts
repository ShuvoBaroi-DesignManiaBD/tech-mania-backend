import { Document, ObjectId } from 'mongoose';

// Comment structure
export interface IComment extends Document {
  postId: ObjectId;
  author: ObjectId;
  parentCommentId?: ObjectId;
  content: string;
  // upvotes: string[];
  // downvotes: string[];
  isDeleted?: boolean;
  isBlocked?: boolean;
  replies?: string[]; // Nested replies
}

export interface IReply extends Document {
  postId: ObjectId;
  author: ObjectId;
  parentCommentId: ObjectId;
  content: string;
  // upvotes: string[];
  // downvotes: string[];
  isDeleted?: boolean;
  isBlocked?: boolean;
  // replies?: string[]; // Nested replies
}

// Comment creation
// export interface CreateComment {
//   postId: string;
//   content: string;
// }

// Comment update
export interface IUpdateComment {
  content: string;
  upvotes: string[];
  downvotes: string[];
  isBlocked?: boolean;
  isDeleted?: boolean;
  replies?: string[];
}

export const TCommentUpdateKeysForUser: string[] = [
  'content',
  'upvotes',
  'downvotes',
  'isDeleted',
  'replies',
];
