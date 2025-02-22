import { Profile } from '@/types/models/profile';
import { Post, PostImages } from '@/types/models/post';

export type IPost = {
  profile: Pick<Profile, 'id' | 'avatar' | 'username' | 'first_name'>
  images: Pick<PostImages, 'image_path'>[]
  likes_count: number
  replies_count: number
  is_liked: boolean
} & Pick<Post, 'id' | 'content' | 'parent_id' | 'created_at' >;
