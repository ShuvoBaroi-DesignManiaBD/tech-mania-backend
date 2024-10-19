import mongoose, { Schema } from 'mongoose';
import { IPost } from './post.interface';

const PostSchema: Schema = new Schema<IPost>(
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
    video: { type: String }, // Array of video URLs (new field)
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  },
  { timestamps: true },
);

export const Post = mongoose.model<IPost>('Post', PostSchema);
