import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/superbase';
import { CreatePostDto, CreatePostImagesDto } from '@/schemas/request/post';
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
    .limit(10)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export type GetPostResponse = Awaited<ReturnType<typeof getPosts>>;

export function useGetPosts() {
  return useQuery({
    queryKey: ['get-posts'],
    queryFn: getPosts,
  });
}
