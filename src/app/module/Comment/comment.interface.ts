import { Document, ObjectId } from "mongoose";

// Comment structure
export interface IComment extends Document {
  postId: ObjectId;
  authorId: ObjectId;
  parentCommentId?: ObjectId;
  content: string;
  upvotes: number;
  downvotes: number;
  replies?: Comment[]; // Nested replies
}

// Comment creation
// export interface CreateComment {
//   postId: string;
//   content: string;
// }

// // Comment update
// export interface UpdateComment {
//   content: string;
// }
