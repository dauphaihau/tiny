import { Profile } from '@/types/models/profile';
import { getDetailPost } from '@/services/post.service';
import { Post } from '@/types/models/post';
import { Database } from '@/types/database.types';
import { GetListParams } from '@/types/request/common';

export interface GetPostsParams extends GetListParams {
  current_profile_id: Profile['id']
  type: Database['public']['Functions']['get_posts']['Args']['type'];
}

export interface GetPostsByProfileParams extends GetListParams {
  pr_id: Post['profile_id']
  type: Database['public']['Functions']['get_posts_by_profile']['Args']['type'];
  current_profile_id: Profile['id']
}

export type PostResponse = Database['public']['Functions']['get_posts']['Returns'][0];

export type GetDetailPostResponse = Awaited<ReturnType<typeof getDetailPost>>;
