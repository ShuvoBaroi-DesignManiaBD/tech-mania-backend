import { Document, ObjectId } from "mongoose";

export type TVote = 'upvote' | 'downvote';
export interface Vote extends Document {
    userId: string;
    postId?: ObjectId;
    commentId?: ObjectId;
    type: TVote;
  }