import { z } from 'zod';
import { Database } from '@/types/database.types';
import { toZod } from 'tozod';

export type PostImages = Database['public']['Tables']['post_images']['Row'];
export type Post = Database['public']['Tables']['posts']['Row'];

export const postSchema: toZod<Post> = z.object({
  id: z.number(),
  profile_id: z.string(),
  parent_id: z.number().nullable(),
  content: z.string(),
  created_at: z.string(),
});
