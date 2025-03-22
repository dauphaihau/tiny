import { GetPostResponse, GetPostsParams } from '@/types/request/post/get-posts';
import { supabase } from '@/lib/supabase';
import { useNavigation } from 'expo-router';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useGetCurrentProfile } from '@/services/profile.service';
import { useEffect, useState } from 'react';
import { IPost } from '@/types/components/common/post';

const getPosts = async (params: GetPostsParams) => {
  const { data, error } = await supabase.rpc('get_posts', {
    current_profile_id: params.current_profile_id,
    page_number: params.page,
    items_per_page: params.itemsPerPage,
    type: params.type,
  });
  if (error) {
    throw new Error(`supabase.rpc get_posts ${error.message}`);
  }
  return data as unknown as GetPostResponse;
};

export function useGetPosts(params: Pick<GetPostsParams, 'type' | 'itemsPerPage'>) {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { data: currentProfile } = useGetCurrentProfile();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [isInitialSetPosts, setIsInitialSetPosts] = useState(true);

  const query = useInfiniteQuery({
    enabled: !!currentProfile?.id,
    queryKey: ['get-posts', params],
    queryFn: ({ pageParam = 1 }) => getPosts({
      ...params,
      current_profile_id: currentProfile!.id,
      page: pageParam,
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.pagination;
      return pagination.has_next ? pagination.current_page + 1 : undefined;
    },
  });

  useEffect(() => {
    if (query.data) {
      setPosts(query.data.pages.flatMap((page) => page.posts));
      setIsInitialSetPosts(false);
    }
  }, [query.data]);

  useEffect(() => {
    const postChannel = supabase
      .channel('posts')
      .on(
        'broadcast',
        { event: 'delete_post' },
        (payload) => {
          const postIdToDelete = payload.payload.post_id;
          setPosts(prevPosts =>
            prevPosts.filter(post => post.id !== postIdToDelete)
          );
        }
      )
      .on(
        'broadcast',
        { event: 'like_post' },
        (payload) => {
          const { post_id, likes_count } = payload.payload;
          setPosts(prevPosts =>
            prevPosts.map(post => 
              post.id === post_id ? 
                { ...post, likes_count } :
                post
            )
          );
        }
      )
      .subscribe();

    const unsubscribeBlur = navigation.addListener('blur', () => {
      queryClient.invalidateQueries({
        queryKey: ['get-posts'],
        exact: false, // invalidate any query key that starts with ['get-posts']
      });
    });

    // ensures your data is always refreshed when returning to the home screen
    const unsubscribeFocus = navigation.addListener('focus', () => {
      query.refetch();
    });

    return () => {
      supabase.removeChannel(postChannel);
      unsubscribeBlur();
      unsubscribeFocus();
    };
  }, [queryClient, navigation, query]);

  return {
    ...query,
    posts,
    isPending: query.isPending || isInitialSetPosts,
  };
}
