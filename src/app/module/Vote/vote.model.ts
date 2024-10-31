import { Schema, model} from 'mongoose';
import { TVote } from './vote.interface';
import { VOTE_TYPE } from './vote.constant';

// Mongoose schema for the Vote model
const VoteSchema: Schema<TVote> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    parentId: { type: Schema.Types.ObjectId, required: true, refPath: 'parentType' },
    parentType: { type: String, required: true, enum: ['Post', 'Comment'] },
    type: { type: String, enum: Object.values(VOTE_TYPE), required: true },
  },
  { timestamps: true }
);

// Create the Vote model
export const Vote = model<TVote>('Vote', VoteSchema);
