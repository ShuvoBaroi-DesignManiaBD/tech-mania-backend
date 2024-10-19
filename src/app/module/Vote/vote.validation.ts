import { z } from "zod";

// Zod schema for validating the vote input
export const voteSchema = z.object({
  userId: z.string().min(1,"User ID is required"),
  postId: z.string().optional(), // Validate ObjectId as a string
  commentId: z.string().optional(),
  type: z.enum(["upvote", "downvote"]),
});

// Validate incoming vote data
export const validateVote = (data: any) => {
  return voteSchema.safeParse(data);
};
