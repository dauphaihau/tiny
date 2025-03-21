import { Post } from '@/types/models/post';
import { useGetCurrentProfile } from '@/services/profile.service';
import React from 'react';
import { IPost } from '@/types/components/common/post';
import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { GetRepliesPostsParams, GetRepliesPostsResponse } from '@/types/request/post/get-replies-post';
import { DETAIL_POST_CONFIG } from '@/components/shared-screens/detail-post/constantds';
import { useGetDetailPost } from '@/services/post.service';

const getRepliesPost = async (params: GetRepliesPostsParams) => {
  const { data, error } = await supabase.rpc('get_replies_post', {
    parent_id: params.parentId,
    current_profile_id: params.currentProfileId,
    items_per_page: params.itemsPerPage,
    page_number: params.page,
  });
  if (error) {
    throw new Error(`supabase.rpc get_replies_post ${error.message}`);
  }
  return data as unknown as GetRepliesPostsResponse;
};

export function useGetRepliesPost(parentId: Post['id']) {
  const { data: currentProfile } = useGetCurrentProfile();
  const { post } = useGetDetailPost(parentId);
  const [replies, setReplies] = React.useState<IPost[]>([]);

  const query = useInfiniteQuery({
    enabled: Boolean(currentProfile?.id) && Boolean(parentId) && post && post?.replies_count > 0,
    queryKey: ['get-replies-post', parentId],
    queryFn: ({ pageParam = 1 }) => getRepliesPost({
      parentId: parentId,
      currentProfileId: currentProfile!.id,
      page: pageParam,
      itemsPerPage: DETAIL_POST_CONFIG.REPLIES_PER_PAGE,
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.pagination;
      return pagination.has_next ? pagination.current_page + 1 : undefined;
    },
  });

  React.useEffect(() => {
    if (query.data) {
      setReplies(query.data.pages.flatMap((page) => page.replies ?? []));
    }
  }, [query.data]);

  return {
    ...query,
    replies,
  };
}
