import { z } from "zod";

export const commentCreationSchema = z.object({
  body: z.object({
    postId: z.string(),
    author: z.string(),
    parentCommentId: z.string().optional(),
    content: z.string(),
    upvotes: z.array(z.string()).optional(),
    downvotes: z.array(z.string()).optional(),
    replies: z.array(z.string()).optional(),
    isDeleted: z.boolean().optional(),
    isBlocked: z.boolean().optional(),
  })
});

export const replyCreationSchema = z.object({
  body: z.object({
    postId: z.string(),
    author: z.string(),
    parentCommentId: z.string(),
    content: z.string(),
    upvotes: z.array(z.string()).optional(),
    downvotes: z.array(z.string()).optional(),
    replies: z.array(z.string()).optional(),
    isDeleted: z.boolean().optional(),
    isBlocked: z.boolean().optional(),
  })
});

// export const createCommentSchema = commentSchema.omit({ id: true });
export const updateCommentSchema = commentCreationSchema.partial();

export const commentValidation = {
  commentCreationSchema,
  updateCommentSchema,
  replyCreationSchema
};