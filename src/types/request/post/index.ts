import { Profile } from '@/types/models/profile';
import { Post } from '@/types/models/post';

export interface GetDetailPostsParams {
  postId: Post['id']
  current_profile_id: Profile['id']
}

export interface SearchPostsParams {
  searchTerm: string;
  latest?: boolean;
  pageSize: number
}