import { Profile } from '@/types/models/profile';
import { Post } from '@/types/models/post';
import { Database } from '@/types/database.types';
import { GetListParams } from '@/types/request/common';

export interface GetPostsParams extends GetListParams {
  current_profile_id: Profile['id']
  type: Database['public']['Functions']['get_posts']['Args']['type'];
}

export interface GetRepliesPostsParams extends GetListParams {
  parent_id: Post['id']
  current_profile_id: Profile['id']
}

export interface GetPostsByProfileParams extends GetListParams {
  pr_id: Post['profile_id']
  type: Database['public']['Functions']['get_posts_by_profile']['Args']['type'];
  current_profile_id: Profile['id']
}

export interface GetDetailPostsParams {
  postId: Post['id']
  current_profile_id: Profile['id']
}

export interface SearchPostsParams {
  searchTerm: string;
  latest?: boolean;
  pageSize: number
}