import { z } from 'zod';
import { postSchema } from '@/schemas/models/post';

export const createPostSchema = z.object({
  profile_id: postSchema.shape.profile_id,
  content: postSchema.shape.content,
});

export const createReplyPostSchema = z.object({
  profile_id: postSchema.shape.profile_id,
  parent_id: postSchema.shape.parent_id,
  content: postSchema.shape.content,
});

export const createPostImagesSchema = z.array(
  z.object({
    post_id: postSchema.shape.id,
    image_path: z.string(),
  })
);

export type CreatePostDto = z.infer<typeof createPostSchema>;
export type CreatePostImagesDto = z.infer<typeof createPostImagesSchema>;
export type CreateReplyPostDto = z.infer<typeof createReplyPostSchema>;
