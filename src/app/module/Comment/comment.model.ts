import mongoose, { Schema } from "mongoose";
import { IComment } from "./comment.interface";

const CommentSchema: Schema = new Schema<IComment>({
  postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  parentCommentId: { type: Schema.Types.ObjectId, ref: 'Comment' },
  content: { type: String, required: true },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  replies: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
}, {timestamps: true});

export const Comment = mongoose.model<IComment>('Comment', CommentSchema);