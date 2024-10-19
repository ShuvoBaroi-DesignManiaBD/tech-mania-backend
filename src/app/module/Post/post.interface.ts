import { ObjectId } from 'mongoose';
import { IComment } from '../Comment/comment.interface';

// Categories for tech posts
export type TPostCategory =
  | 'Web'
  | 'Software Engineering'
  | 'AI'
  | 'Gadgets'
  | 'Apps';

// Post structure
export interface IPost {
  // id: string;
  author: ObjectId;
  title: string;
  content: string; // Could be HTML or Markdown depending on the editor
  category: TPostCategory;
  tags: string[];
  premium: boolean;
  images?: string[];
  video?: string;
  upvotes: number;
  downvotes: number;
  isDeleted: boolean;
  isBlocked: boolean;
  comments: IComment[];
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
  'isDeleted',
];
