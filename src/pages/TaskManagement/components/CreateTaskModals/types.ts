import { z } from "zod";

export const createTaskFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  status: z.string().min(1, "Status is required"),
  dueDate: z.string().min(1, "Due Date is required"),
});

export type CreateTaskFormType = z.infer<typeof createTaskFormSchema>;
