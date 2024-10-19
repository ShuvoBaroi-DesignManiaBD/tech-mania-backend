import { Schema, model, Document, ObjectId } from "mongoose";
import { TVote } from "./vote.interface";


// Mongoose schema for the Vote model
const voteSchema = new Schema<TVote>({
  userId: { type: String, required: true },
  postId: { type: Schema.Types.ObjectId, ref: "Post" },
  commentId: { type: Schema.Types.ObjectId, ref: "Comment" },
  type: { type: String, enum: ["upvote", "downvote"], required: true },
}, {
  timestamps: true,  // Automatically adds createdAt and updatedAt fields
});

// Create the Vote model
export const Vote = model<TVote>("Vote", voteSchema);
