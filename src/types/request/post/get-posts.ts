import { Profile } from '@/types/models/profile';
import { GetListParams, PaginationMetadata } from '@/types/request/common';
import { IPost } from '@/types/components/common/post';

export enum GetPostsTypes {
  ALL = 'all',
  FOLLOWING = 'following'
}

export interface GetPostsParams extends GetListParams {
  current_profile_id: Profile['id']
  type: GetPostsTypes.ALL | GetPostsTypes.FOLLOWING;
}

export interface GetPostResponse {
  posts: IPost[];
  pagination: PaginationMetadata;
}
