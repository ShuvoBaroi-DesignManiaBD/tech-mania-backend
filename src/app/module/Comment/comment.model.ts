import mongoose, { Schema } from 'mongoose';
import { IComment } from './comment.interface';
import { Vote } from '../Vote/vote.model';
import { VOTE_TYPE } from '../Vote/vote.constant';

const CommentSchema: Schema<IComment> = new Schema<IComment>(
  {
    postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    parentCommentId: { type: Schema.Types.ObjectId, ref: 'Comment' },
    content: { type: String, required: true },
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    replies: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  },
  { timestamps: true },
);

// // Virtual for the number of upvotes
// CommentSchema.virtual('numberOfUpvotes').get(async function () {
//   return await Vote.countDocuments({ parentId: this._id, type: VOTE_TYPE.UPVOTE, parentType: "Comment" });
// });

// // Virtual for the number of downvotes
// CommentSchema.virtual('numberOfDownvotes').get(async function () {
//   return await Vote.countDocuments({ parentId: this._id, type: VOTE_TYPE.DOWNVOTE, parentType: "Comment" });
// });

// // Virtual for the number of downvotes
// CommentSchema.virtual('replies').get(async function () {
//   return await Comment.find({ parentCommentId: this._id, postId: this.postId }).populate('author', '_id name email profilePicture verified');
// });


// // Ensure virtual fields are included in JSON and Object representations
// CommentSchema.set('toJSON', { virtuals: true });
// CommentSchema.set('toObject', { virtuals: true });

export const Comment = mongoose.model<IComment>('Comment', CommentSchema);
