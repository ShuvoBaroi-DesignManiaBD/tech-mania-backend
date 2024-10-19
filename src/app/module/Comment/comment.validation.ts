import { z } from "zod";

export const commentSchema = z.object({
  postId: z.string(),
  authorId: z.string(),
  content: z.string(),
  upvotes: z.number().default(0),
  downvotes: z.number().default(0),
  replies: z.array(z.any()).optional(),
});

// export const createCommentSchema = commentSchema.omit({ id: true });
export const updateCommentSchema = commentSchema.partial();
