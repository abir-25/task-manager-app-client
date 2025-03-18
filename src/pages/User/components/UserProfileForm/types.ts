import { z } from "zod";

export const updateUserProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  phone: z.string().nullable().optional(),
  profileImg: z
    .union([z.string(), z.instanceof(File), z.null()])
    .nullable()
    .optional(),
});

export type UpdateUserProfileFormType = z.infer<typeof updateUserProfileSchema>;
