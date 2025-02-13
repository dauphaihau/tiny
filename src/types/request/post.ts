import { Profile } from '@/types/models/profile';
import { getDetailPost } from '@/services/post.service';
import { Post, PostImages } from '@/types/models/post';
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

export type GetDetailPostResponse = Awaited<ReturnType<typeof getDetailPost>> & {
  profile: Pick<Profile, 'id' | 'avatar' | 'username' | 'first_name'>
  images: Pick<PostImages, 'image_path'>[]
};
