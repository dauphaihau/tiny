import { GetPostsByProfileParams } from '@/types/request/post/get-posts-by-profile';

export type SearchParams = {
  id: string
  type: GetPostsByProfileParams['type']
};
