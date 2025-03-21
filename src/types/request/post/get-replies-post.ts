import { Post } from '@/types/models/post';
import { Profile } from '@/types/models/profile';
import { GetListParams, PaginationMetadata } from '@/types/request/common';
import { IPost } from '@/types/components/common/post';

export interface GetRepliesPostsParams extends GetListParams {
  parentId: Post['id']
  currentProfileId: Profile['id']
}

export interface GetRepliesPostsResponse {
  replies: IPost[] | null
  pagination: PaginationMetadata
}
