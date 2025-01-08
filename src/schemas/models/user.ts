import { z } from 'zod';

export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  first_name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
  last_name: z.string().optional(),
  bio: z.string().optional(),
  avatar: z.string().optional(),
});

export type User = z.infer<typeof userSchema>;
