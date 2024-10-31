import { z } from "zod";

// Zod schema for validating the vote input
export const voteValidateSchema = z.object({
  body: z.object({
    userId: z.string().min(1,"User ID is required"),
    parentId: z.string().optional(), // Validate ObjectId as a string
    type: z.enum(["upvote", "downvote"]),
  })
});

export const updateVoteSchema = voteValidateSchema.partial();

// // Validate incoming vote data
// export const validateVote = (data: any) => {
//   return voteSchema.safeParse(data);
// };

export const VoteValidation = {
  voteValidateSchema,
  updateVoteSchema
};