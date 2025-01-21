import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { CreatePostDto, CreatePostImagesDto, CreateReplyPostDto } from '@/schemas/request/post';
import { Post } from '@/schemas/models/post';

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

const getPosts = async (params: GetPostsParams) => {
  const from = params.limit * (params.page - 1);
  const to = from + params.limit - 1;

  let query = supabase
    .from('posts')
    .select(`
          id,
          content,
          created_at,
          parent_id,
          profile:profile_id (
            id, avatar, username
          ),
          images:post_images (
            id, image_path
          )
        `)
    .range(from, to)
    .order('created_at', { ascending: false });

  if (params.profile_id) {
    query = query.eq('profile_id', params.profile_id);
  }

  switch (params.type) {
    case 'replies': {
      query = query.not('parent_id', 'is', null);
      break;
    }
    default:
      query = query.is('parent_id', null);
  }

  const { data, error } = await query;

  if (error) {
    console.log('error', error);
    throw new Error();
  }
  return {
    data,
    nextPage: data?.length ? params.page + 1 : undefined,
  };
};

export type GetPostsResponse = Awaited<ReturnType<typeof getPosts>>;

export interface GetPostsParams {
  limit: number;
  page: number;
  profile_id?: Post['profile_id']
  type?: 'posts' | 'replies' | 'media'
}

export function useGetPosts(params: GetPostsParams) {
  return useInfiniteQuery({
    queryKey: ['get-posts', params],
    queryFn: ({ pageParam = 1 }) => getPosts({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
}

const getDetailPost = async (postId: Post['id']) => {
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

export type GetDetailPostResponse = Awaited<ReturnType<typeof getDetailPost>>;

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
