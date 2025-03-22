import {
  GetPostsByProfileParams,
  GetPostsByProfileResponse,
  PostsByProfileType
} from '@/types/request/post/get-posts-by-profile';
import { useGetCurrentProfile } from '@/services/profile.service';
import React, { useState } from 'react';
import { IPost } from '@/types/components/common/post';
import { useNavigation } from 'expo-router';
import { useInfiniteQuery, useQueryClient, InfiniteData } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { DETAIL_PROFILE_CONFIG } from '@/components/shared-screens/detail-profile/constants';

const getPostsByProfile = async (params: GetPostsByProfileParams) => {
  const type = params?.type ?? PostsByProfileType.ROOT;

  const { data, error } = await supabase.rpc('get_posts_by_profile', {
    target_profile_id: params.targetProfileId,
    current_profile_id: params.currentProfileId,
    page_number: params.page,
    items_per_page: params.itemsPerPage,
    type,
  });
  if (error) {
    throw new Error(`supabase.rpc get_posts_by_profile ${error.message}`);
  }
  return data as unknown as GetPostsByProfileResponse;
};

export function useGetPostsByProfile(
  params: Pick<GetPostsByProfileParams, 'targetProfileId' | 'type'>
) {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { data: currentProfile } = useGetCurrentProfile();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [isInitialSetPosts, setIsInitialSetPosts] = useState(true);

  const query = useInfiniteQuery({
    enabled: !!currentProfile?.id,
    queryKey: ['get-posts-by-profile', params],
    queryFn: ({ pageParam = 1 }) => getPostsByProfile({
      ...params,
      currentProfileId: currentProfile!.id,
      page: pageParam,
      itemsPerPage: DETAIL_PROFILE_CONFIG.ITEMS_PER_PAGE,
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.pagination;
      return pagination.has_next ? pagination.current_page + 1 : undefined;
    },
  });

  React.useEffect(() => {
    if (query.data) {
      setPosts(query.data.pages.flatMap((page) => page.posts));
      setIsInitialSetPosts(false);
    }
  }, [query.data]);

  React.useEffect(() => {
    const postChannel = supabase
      .channel('posts')
      .on(
        'broadcast',
        { event: 'new_post' },
        (payload) => {
          const newPost = payload.payload;

          if (params.targetProfileId === newPost.profile.id) {
            queryClient.invalidateQueries({
              queryKey: ['get-posts-by-profile'],
              exact: false,
            });
            if (params.type === 'root' && !newPost.parent_id) {
              setPosts(prevPosts => [payload.payload, ...prevPosts]);
            }
            else if (params.type === 'media' && newPost?.images?.length > 0) {
              setPosts(prevPosts => [payload.payload, ...prevPosts]);
            }
          }
        }
      )
      .on(
        'broadcast',
        { event: 'delete_post' },
        (payload) => {
          const postIdToDelete = payload.payload.post_id;
          setPosts(prevPosts =>
            prevPosts.filter(post => post.id !== postIdToDelete)
          );

          // Also update the query cache to filter out the deleted post
          if (query.data) {
            queryClient.setQueryData(
              ['get-posts-by-profile', params],
              (previousData: InfiniteData<GetPostsByProfileResponse> | undefined) => {
                if (!previousData) return previousData;

                return {
                  ...previousData,
                  pages: previousData.pages.map((page) => ({
                    ...page,
                    posts: page.posts.filter((post) => post.id !== postIdToDelete),
                  })),
                };
              }
            );
          }
        }
      )
      .subscribe();

    const unsubscribeBlur = navigation.addListener('blur', () => {
      queryClient.invalidateQueries({
        queryKey: ['get-posts-by-profile'],
        exact: false,
      });
    });

    const unsubscribeFocus = navigation.addListener('focus', () => {
      query.refetch();
    });

    return () => {
      supabase.removeChannel(postChannel);
      unsubscribeBlur();
      unsubscribeFocus();
    };
  }, [navigation, params, params.targetProfileId, params.type, posts, query, queryClient]);

  return {
    ...query,
    posts,
    isPending: query.isPending || isInitialSetPosts,
  };
}
