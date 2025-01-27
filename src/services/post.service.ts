import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { CreatePostDto, CreatePostImagesDto, CreateReplyPostDto } from '@/schemas/request/post';
import { useGetCurrentProfile } from '@/services/profile.service';
import { GetPostsByProfileParams, GetPostsParams } from '@/types/request/posts';
import { Post } from '@/types/models/post';

const getPosts = async (params: GetPostsParams) => {
  const from = params.limit * (params.page - 1);
  const to = from + params.limit - 1;

  const { data, error } = await supabase.rpc('get_posts', {
    current_profile_id: params.current_profile_id,
    from_offset: from,
    to_offset: to,
  });

  if (error) {
    console.log('error', error);
    throw new Error();
  }
  return {
    data,
    nextPage: data?.length ? params.page + 1 : undefined,
  };
};

const getPostsByProfile = async (params: GetPostsByProfileParams) => {
  const from = params.limit * (params.page - 1);
  const to = from + params.limit - 1;
  const type = params?.type ?? 'posts';

  const { data, error } = await supabase.rpc('get_posts_by_profile', {
    pr_id: params.pr_id,
    current_profile_id: params.current_profile_id,
    from_offset: from,
    to_offset: to,
    type,
  });

  if (error) {
    console.log('error', error);
    throw new Error();
  }
  return {
    data,
    nextPage: data?.length ? params.page + 1 : undefined,
  };
};

export const getDetailPost = async (postId: Post['id']) => {
  const { data, error } = await supabase
    .from('posts')
    .select(`
          id,
          content,
          created_at,
          profile:profile_id (
            id, avatar, username
          ),
          images:post_images (
            id, image_path
          ),
          sub_posts:posts (
            parent_id, 
            id,
            content,
            created_at,
            profile:profile_id (
              id, avatar, username
            ),
            images:post_images (
              id, image_path
            )
          )
        `)
    .order('created_at', { referencedTable: 'sub_posts', ascending: false })
    .eq('id', postId)
    .limit(1)
    .single();
  if (error) {
    console.log('error', error);
    throw new Error();
  }
  return data;
};

// hooks

export function useCreatePostImages() {
  return useMutation({
    mutationKey: ['create-post-images'],
    mutationFn: async (body: CreatePostImagesDto) => {
      return supabase
        .from('post_images')
        .insert(body)
      ;
    },
  });
}

export function useCreatePost() {
  return useMutation({
    mutationKey: ['create-post'],
    mutationFn: async (body: CreatePostDto) => {
      return supabase
        .from('posts')
        .insert(body)
        .select('id')
        .single<Pick<Post, 'id'>>()
      ;
    },
  });
}

export function useGetPosts(params: Omit<GetPostsParams, 'current_profile_id'>) {
  const { data: currentProfile } = useGetCurrentProfile();
  return useInfiniteQuery({
    enabled: !!currentProfile?.id,
    queryKey: ['get-posts', params],
    queryFn: ({ pageParam = 1 }) => getPosts({
      ...params,
      current_profile_id: currentProfile!.id,
      page: pageParam,
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
}

export function useGetPostsByProfile(params: Omit<GetPostsByProfileParams, 'current_profile_id'>) {
  const { data: currentProfile } = useGetCurrentProfile();
  return useInfiniteQuery({
    enabled: !!currentProfile?.id,
    queryKey: ['get-posts-by-profile', params],
    queryFn: ({ pageParam = 1 }) => getPostsByProfile({
      ...params,
      current_profile_id: currentProfile!.id,
      page: pageParam,
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
}

export function useGetDetailPost(postId: Post['id']) {
  return useQuery({
    enabled: !!postId,
    queryKey: ['detail-post', postId],
    queryFn: () => getDetailPost(postId),
  });
}

export function useCreateReply() {
  return useMutation({
    mutationKey: ['create-reply'],
    mutationFn: async (body: CreateReplyPostDto) => {
      console.log('body', body);
      return supabase
        .from('posts')
        .insert(body)
        .select('id')
        .single<Pick<Post, 'id'>>()
      ;
    },
  });
}

export function useDeletePost(postId: Post['id']) {
  return useMutation({
    mutationKey: ['delete-post', postId],
    mutationFn: async () => {
      return supabase
        .from('posts')
        .delete()
        .eq('id', postId);
    },
  });
}

export function useToggleLike() {
  const { data: currentProfile } = useGetCurrentProfile();
  return useMutation({
    mutationKey: ['toggle-like'],
    mutationFn: async (postId: Post['id']) => {
      const res = await supabase
        .from('likes')
        .insert({
          profile_id: currentProfile?.id,
          post_id: postId,
        })
      ;
      console.log('res-error', res.error);
      return res;
    },
  });
}
