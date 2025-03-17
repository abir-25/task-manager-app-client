import { z } from "zod";

export const updateUserProfileSchema = z.object({
  id: z.number(),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  phone: z.string().nullable(),
  profileImg: z.union([z.string(), z.instanceof(File), z.null()]).nullable(),
});

export type UpdateUserProfileFormType = z.infer<
  typeof updateUserProfileSchema
> & {
  id: number;
};
