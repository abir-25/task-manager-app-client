import { z } from "zod";

export const createTaskFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  status: z.string().min(1, "Status is required"),
  dueDate: z.date({ required_error: "Due date is required" }),
});

export type CreateTaskFormType = z.infer<typeof createTaskFormSchema>;
