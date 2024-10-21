import mongoose, { Schema } from 'mongoose';
import { IComment } from './comment.interface';

const CommentSchema: Schema<IComment> = new Schema<IComment>(
  {
    postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    parentCommentId: { type: Schema.Types.ObjectId, ref: 'Comment' },
    content: { type: String, required: true },
    upvotes: [{ type: Schema.Types.ObjectId, ref: 'User'}],
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    downvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    replies: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  },
  { timestamps: true },
);

// Virtual for the number of upvotes
CommentSchema.virtual('numberOfUpvotes').get(function () {
  return this.upvotes?.length;
});

// Virtual for the number of downvotes
CommentSchema.virtual('numberOfDownvotes').get(function () {
  return this.downvotes?.length;
});

// Virtual for the number of comments
CommentSchema.virtual('numberOfReplies').get(function () {
  return this.replies?.length;
});

// Ensure virtual fields are included in JSON and Object representations
CommentSchema.set('toJSON', { virtuals: true });
CommentSchema.set('toObject', { virtuals: true });

export const Comment = mongoose.model<IComment>('Comment', CommentSchema);
