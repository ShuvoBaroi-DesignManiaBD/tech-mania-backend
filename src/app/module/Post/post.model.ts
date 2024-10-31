// import mongoose, { Schema } from 'mongoose';
// import { IPost } from './post.interface';
// import { Vote } from '../Vote/vote.model';
// import { VOTE_TYPE } from '../Vote/vote.constant';

// const PostSchema: Schema<IPost> = new Schema<IPost>(
//   {
//     author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//     title: { type: String, required: true },
//     content: { type: String, required: true },
//     category: {
//       type: String,
//       enum: ['Web', 'Software Engineering', 'AI', 'Gadgets', 'Apps'],
//       required: true,
//     },
//     tags: { type: [String], default: [] },
//     premium: { type: Boolean, default: false },
//     isBlocked: { type: Boolean, default: false },
//     isDeleted: { type: Boolean, default: false },
//     images: [{ type: String }], // Array of image URLs
//     video: { type: String }, // Video URL
//     upvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Referencing users who upvoted
//     downvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Referencing users who downvoted
//     comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
//   },
//   { timestamps: true },
// );

// // Virtual for the number of upvotes
// PostSchema.virtual('numberOfUpvotes').get(async function () {
//   const upvotes = await Vote.countDocuments({ parentId: this._id, type: VOTE_TYPE.UPVOTE });
//   if (!upvotes || typeof upvotes !== 'number') {
//     return 0;
//   }
//   console.log('upvotes',upvotes);
  
//   return upvotes as number;
// });

// // Virtual for the number of downvotes
// PostSchema.virtual('numberOfDownvotes').get(async function () {
//   const downvotes = await Vote.countDocuments({ parentId: this._id, type: VOTE_TYPE.DOWNVOTE });
//   if (!downvotes || typeof downvotes !== 'number') {
//     return 0;
//   }
//   return downvotes as number;
//   // return this.downvotes?.length;
// });

// // Virtual for the number of comments
// PostSchema.virtual('numberOfComments').get(function () {
//   return this.comments?.length;
// });

// // Ensure virtual fields are included in JSON and Object representations
// PostSchema.set('toJSON', { virtuals: true });
// PostSchema.set('toObject', { virtuals: true });

// export const Post = mongoose.model<IPost>('Post', PostSchema);


import mongoose, { Schema, Document, Model } from 'mongoose';
import { IPost } from './post.interface';
import { Vote } from '../Vote/vote.model';
import { VOTE_TYPE } from '../Vote/vote.constant';

interface IPostDocument extends IPost, Document {
  getNumberOfUpvotes: () => Promise<number>;
  getNumberOfDownvotes: () => Promise<number>;
  getNumberOfComments: () => number;
}

interface IPostModel extends Model<IPostDocument> {
  getNumberOfUpvotesById: (id: string) => Promise<number>;
  getNumberOfDownvotesById: (id: string) => Promise<number>;
}

const PostSchema: Schema<IPostDocument> = new Schema<IPostDocument>(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: {
      type: String,
      enum: ['Web', 'Software Engineering', 'AI', 'Gadgets', 'Apps'],
      required: true,
    },
    tags: { type: [String], default: [] },
    premium: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    images: [{ type: String }], // Array of image URLs
    video: { type: String }, // Video URL
    upvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Referencing users who upvoted
    downvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Referencing users who downvoted
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  },
  { timestamps: true },
);

// Instance methods
PostSchema.methods.getNumberOfUpvotes = async function () {
  return await Vote.countDocuments({ parentId: this._id, type: VOTE_TYPE.UPVOTE });
};

PostSchema.methods.getNumberOfDownvotes = async function () {
  return await Vote.countDocuments({ parentId: this._id, type: VOTE_TYPE.DOWNVOTE });
};

PostSchema.methods.getNumberOfComments = function () {
  return this.comments?.length || 0;
};

export const Post = mongoose.model<IPostDocument, IPostModel>('Post', PostSchema);
