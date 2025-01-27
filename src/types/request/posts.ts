import { Profile } from '@/types/models/profile';
import { getDetailPost } from '@/services/post.service';
import { Post } from '@/types/models/post';
import { Database } from '@/types/database.types';

export interface GetPostsParams {
  limit: number;
  page: number;
  current_profile_id: Profile['id']
}

export interface GetPostsByProfileParams extends GetPostsParams {
  pr_id: Post['profile_id']
  type?: 'posts' | 'replies'
}

export type PostResponse = Database['public']['Functions']['get_posts']['Returns'][0];

export type GetDetailPostResponse = Awaited<ReturnType<typeof getDetailPost>>;
