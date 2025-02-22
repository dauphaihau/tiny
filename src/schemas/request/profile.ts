import { z } from 'zod';
import { profileSchema } from '@/schemas/models/profile';

export const updateProfileSchema = z.object({
  name: profileSchema.shape.first_name,
  bio: z.string().optional(),
  avatar: z.string().optional(),
});

export type UpdateUserDto = z.infer<typeof updateProfileSchema>;
