import mongoose, { Schema } from 'mongoose';
import { IPost } from './post.interface';

const PostSchema: Schema<IPost> = new Schema<IPost>(
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

// Virtual for the number of upvotes
PostSchema.virtual('numberOfUpvotes').get(function () {
  return this.upvotes?.length;
});

// Virtual for the number of downvotes
PostSchema.virtual('numberOfDownvotes').get(function () {
  return this.downvotes?.length;
});

// Virtual for the number of comments
PostSchema.virtual('numberOfComments').get(function () {
  return this.comments?.length;
});

// Ensure virtual fields are included in JSON and Object representations
PostSchema.set('toJSON', { virtuals: true });
PostSchema.set('toObject', { virtuals: true });

export const Post = mongoose.model<IPost>('Post', PostSchema);
