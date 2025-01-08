import { z } from 'zod';
import { userSchema } from '@/schemas/models/user';

export const updateUserSchema = z.object({
  name: userSchema.shape.first_name,
  bio: z.string().optional(),
  avatar: z.string().optional(),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
