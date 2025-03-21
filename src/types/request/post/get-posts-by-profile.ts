import { Profile } from '@/types/models/profile';
import { Post } from '@/types/models/post';
import { GetListParams, PaginationMetadata } from '@/types/request/common';
import { IPost } from '@/types/components/common/post';

export enum PostsByProfileType {
  ROOT = 'root',
  REPLY = 'reply',
  MEDIA = 'media'
}

export interface GetPostsByProfileParams extends GetListParams {
  targetProfileId: Post['profile_id']
  type: `${PostsByProfileType}`
  currentProfileId: Profile['id']
}

export interface GetPostsByProfileResponse {
  posts: IPost[];
  pagination: PaginationMetadata;
}
