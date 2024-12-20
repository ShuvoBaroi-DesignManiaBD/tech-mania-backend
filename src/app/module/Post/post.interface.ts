import { ObjectId } from 'mongoose';
import { IComment } from '../Comment/comment.interface';
import { Document } from 'mongoose';

// Categories for tech posts
export type TPostCategory =
  | 'Web'
  | 'Software Engineering'
  | 'AI'
  | 'Gadgets'
  | 'Apps';

// Post structure
export interface IPost extends Document {
  // id: string;
  author: string | IAuthor;
  title: string;
  content: string; // Could be HTML or Markdown depending on the editor
  category: TPostCategory;
  tags: string[];
  premium: boolean;
  images?: string[];
  video?: string;
  upvotes: string[];
  downvotes: string[];
  isDeleted: boolean;
  isBlocked: boolean;
  comments?: string[];
}

export interface IAuthor {
  _id: string;
  name: string;
  username: string;
  email: string;
  phone?: string;
  profilePicture?: string;
  verified: boolean;
}
// Post creation interface
export interface CreatePost {
  author: ObjectId;
  title: string;
  content: string;
  category: TPostCategory;
  tags?: string[];
  premium?: boolean;
  images?: string[];
}

// Post update interface
export interface UpdatePost {
  title?: string;
  content?: string;
  category?: TPostCategory;
  tags?: string[];
  premium?: boolean;
  images?: string[];
}

// Upvote/Downvote system
export interface Vote {
  userId: string;
  postId: string;
  type: 'upvote' | 'downvote';
}

export const TPostKeys: string[] = [
  'author',
  'title',
  'content',
  'category',
  'tags',
  'premium',
  'images',
  'upvotes',
  'downvotes',
  'isDeleted',
  'isBlocked',
  'comments',
];

export const TPostUpdateKeys: string[] = [
  'title',
  'content',
  'category',
  'tags',
  'images',
  'video',
  'isDeleted',
];
