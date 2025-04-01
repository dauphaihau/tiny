import { Post } from '@/types/models/post';
import { z } from 'zod';
import { toZod } from 'tozod';

export const postSchema: toZod<Post> = z.object({
  id: z.number(),
  profile_id: z.string(),
  parent_id: z.number().nullable(),
  content: z.string().nullable(),
  created_at: z.string(),
});
