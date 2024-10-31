import { Document, ObjectId } from 'mongoose';

export type TVoteType = 'upvote' | 'downvote';
export interface TVote extends Document {
  userId: ObjectId;
  parentId: ObjectId;
  isDeleted?: boolean;
  parentType: string;
  type: TVoteType;
}
