import { z } from "zod";

const categoryEnum = z.enum(['Web', 'Software Engineering', 'AI', 'Gadgets', 'Apps']);

export const postSchema = z.object({
  body: z.object({
    author: z.string(),
    title: z.string().min(1),
    content: z.string(),
    category: categoryEnum,
    tags: z.array(z.string()).optional(),
    premium: z.boolean().default(false),
    images: z.array(z.string()).optional(),
    upvotes: z.array(z.string()).optional(),
    downvotes: z.array(z.string()).optional(),
    comments: z.array(z.string()).optional(),
    isBlocked: z.boolean().optional(),
    isDeleted: z.boolean().optional(),
  })
});

export const postUpdateSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  category: categoryEnum.optional(),
  tags: z.array(z.string()).optional(),
  premium: z.boolean().optional(),
  images: z.array(z.string()).optional(),
  upvotes: z.array(z.string()).optional(),
  downvotes: z.array(z.string()).optional(),
  comments: z.array(z.string()).optional(),
  isBlocked: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
});

export const postContentUpdateSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  category: categoryEnum.optional(),
  tags: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  isDeleted: z.boolean().optional(),
});

// export const createPostSchema = postSchema.omit({ id: true });
export const updatePostContentSchema = postSchema.partial();


export const PostValidation = {
  postSchema,
  postUpdateSchema,
  postContentUpdateSchema
};