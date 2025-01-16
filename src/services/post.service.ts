import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/superbase';
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

const getPosts = async () => {
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
          )
        `)
    .is('parent_id', null)
    .limit(10)
    .order('created_at', { ascending: false });
  if (error) {
    console.log('error', error);
    throw new Error();
  }
  return data;
};

export type GetPostsResponse = Awaited<ReturnType<typeof getPosts>>;

export function useGetPosts() {
  return useQuery({
    queryKey: ['get-posts'],
    queryFn: getPosts,
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
