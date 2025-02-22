import { z } from 'zod';
import { toZod } from 'tozod';
import { PROFILE } from '@/constants/profile';
import { Profile } from '@/types/models/profile';

export const profileSchema: toZod<Profile> = z.object({
  id: z.string(),
  username: z.string().max(PROFILE.MAX_USERNAME).nullable(),
  first_name: z.string().min(2, { message: 'Name must be at least 2 characters long' }).max(50),
  last_name: z.string().max(50).nullable(),
  bio: z.string().nullable(),
  avatar: z.string().nullable(),
});