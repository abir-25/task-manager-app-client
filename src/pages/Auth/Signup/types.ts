import { z } from 'zod';

export const signupFormSchema = z.object({
  username: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 8 characters long' }),
});

export type SignupFormType = z.infer<typeof signupFormSchema>;
