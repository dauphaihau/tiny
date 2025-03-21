import {
  useInfiniteQuery, useMutation, useQuery
} from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { CreatePostDto, CreatePostImagesDto, CreateReplyPostDto } from '@/schemas/request/post';
import { useGetCurrentProfile } from '@/services/profile.service';
import { Post } from '@/types/models/post';
import { IPost } from '@/types/components/common/post';
import { GetDetailPostsParams, SearchPostsParams } from '@/types/request/post';

const getDetailPost = async (params: GetDetailPostsParams) => {
  const { data, error } = await supabase.rpc('get_detail_post', {
    post_id: params.postId,
    current_profile_id: params.current_profile_id,
  });
  if (error) {
    console.log('error get detail post', error);
    throw new Error();
  }
  return data[0];
};

export const deletePost = async (postId: Post['id']) => {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId);
  if (error) throw new Error(error.message);
};

export const createPost = async (body: CreatePostDto) => {
  const { data, error } = await supabase
    .from('posts')
    .insert(body)
    .select('id,created_at,parent_id,content')
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const createPostImages = async (body: CreatePostImagesDto) => {
  const { error } = await supabase
    .from('post_images')
    .insert(body)
    .select('image_path');
  if (error) throw new Error(`Error creating post images: ${error.message}`);
};

// hooks

export function useGetDetailPost(postId: Post['id']) {
  const { data: currentProfile } = useGetCurrentProfile();
  const query = useQuery({
    enabled: Boolean(postId) && Boolean(currentProfile?.id),
    queryKey: ['detail-post', postId],
    queryFn: () => getDetailPost({
      postId,
      current_profile_id: currentProfile!.id,
    }),
    staleTime: 1000 * 60, // Consider data fresh for 1 minute
    refetchOnMount: true, // Refetch in background when component mounts
  });
  return {
    ...query,
    post: query.data as IPost | undefined,
  };
}

export function useCreateReply() {
  return useMutation({
    mutationKey: ['create-reply'],
    mutationFn: async (body: CreateReplyPostDto) => {
      return supabase
        .from('posts')
        .insert(body)
        .select('id')
        .single<Pick<Post, 'id'>>();
    },
  });
}

export function useToggleLikePost() {
  const { data: currentProfile } = useGetCurrentProfile();
  return useMutation({
    mutationKey: ['toggle-like'],
    mutationFn: async (postId: Post['id']) => {
      return supabase
        .from('likes')
        .insert({
          profile_id: currentProfile?.id,
          post_id: postId,
        });
    },
  });
}

export function useSearchPosts({
  searchTerm,
  latest = false,
  pageSize = 10,
}: SearchPostsParams) {
  const { data: currentProfile } = useGetCurrentProfile();

  const query = useInfiniteQuery({
    enabled: !!currentProfile?.id && !!searchTerm,
    queryKey: ['search-posts', searchTerm, latest],
    queryFn: async ({ pageParam = 1 }) => {
      if (!currentProfile?.id) throw new Error('Current profile ID is undefined');

      const { data, error } = await supabase.rpc('search_posts', {
        search_term: searchTerm,
        current_profile_id: currentProfile.id,
        latest,
        items_per_page: pageSize,
        page_number: pageParam,
      });

      if (error) throw new Error(error.message);

      return {
        data,
        nextPage: data.length === pageSize ? pageParam + 1 : undefined,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  return {
    ...query,
    posts: query.data?.pages.flatMap(page => page.data as IPost[]) ?? [],
  };
}
