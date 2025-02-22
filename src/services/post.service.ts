import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { CreatePostDto, CreatePostImagesDto, CreateReplyPostDto } from '@/schemas/request/post';
import { useGetCurrentProfile } from '@/services/profile.service';
import {
  GetDetailPostsParams, GetPostsByProfileParams, GetPostsParams, GetRepliesPostsParams, SearchPostsParams
} from '@/types/request/post';
import { Post } from '@/types/models/post';
import React from 'react';
import { IPost } from '@/types/components/common/post';

const getPosts = async (params: GetPostsParams) => {
  const { data, error } = await supabase.rpc('get_posts', {
    current_profile_id: params.current_profile_id,
    page_number: params.page,
    items_per_page: params.limit,
    type: params.type,
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

const getRepliesPost = async (params: GetRepliesPostsParams) => {
  const pOffset = params.limit * (params.page - 1);

  const { data, error } = await supabase.rpc('get_replies_post', {
    parent_id: params.parent_id,
    current_profile_id: params.current_profile_id,
    p_limit: params.limit,
    p_offset: pOffset,
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

export const getDetailPost = async (params: GetDetailPostsParams) => {
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

export function useGetPosts(params: Pick<GetPostsParams, 'type'>) {
  const LIMIT = 10;
  const { data: currentProfile } = useGetCurrentProfile();
  const [posts, setPosts] = React.useState<IPost[]>([]);

  const query = useInfiniteQuery({
    enabled: !!currentProfile?.id,
    queryKey: ['get-posts', params],
    queryFn: ({ pageParam = 1 }) => getPosts({
      ...params,
      current_profile_id: currentProfile!.id,
      page: pageParam,
      limit: LIMIT,
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.data.length < LIMIT ? undefined : lastPage.nextPage,
  });

  React.useEffect(() => {
    if (query.data) {
      setPosts(query.data.pages.flatMap((page) => page.data as IPost[]));
    }
  }, [query.data]);

  React.useEffect(() => {
    const postChannel = supabase
      .channel('posts')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts',
        },
        () => {
          query.refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(postChannel);
    };
  }, []);

  return {
    ...query,
    posts,
  };
}

export function useGetPostsByProfile(params: Pick<GetPostsByProfileParams, 'pr_id' | 'type'>) {
  const LIMIT = 10;
  const { data: currentProfile } = useGetCurrentProfile();
  const [posts, setPosts] = React.useState<IPost[]>([]);

  const query = useInfiniteQuery({
    enabled: !!currentProfile?.id,
    queryKey: ['get-posts-by-profile', params],
    queryFn: ({ pageParam = 1 }) => getPostsByProfile({
      ...params,
      current_profile_id: currentProfile!.id,
      page: pageParam,
      limit: LIMIT,
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.data.length < LIMIT ? undefined : lastPage.nextPage,
  });

  React.useEffect(() => {
    if (query.data) {
      setPosts(query.data.pages.flatMap((page) => page.data as IPost[]));
    }
  }, [query.data]);

  return {
    ...query,
    posts,
  };
}

export function useGetRepliesPost(parentId: Post['id']) {
  const LIMIT = 10;
  const { data: currentProfile } = useGetCurrentProfile();
  const [posts, setPosts] = React.useState<IPost[]>([]);

  const query = useInfiniteQuery({
    enabled: !!currentProfile?.id || !!parentId,
    queryKey: ['get-replies-post', parentId],
    queryFn: ({ pageParam = 1 }) => getRepliesPost({
      parent_id: parentId,
      current_profile_id: currentProfile!.id,
      page: pageParam,
      limit: LIMIT,
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.data.length < LIMIT ? undefined : lastPage.nextPage,
  });

  React.useEffect(() => {
    if (query.data) {
      setPosts(query.data.pages.flatMap((page) => page.data as IPost[]));
    }
  }, [query.data]);

  return {
    ...query,
    posts,
  };
}

export function useGetDetailPost(postId: Post['id']) {
  const { data: currentProfile } = useGetCurrentProfile();
  const query = useQuery({
    enabled: !!postId,
    queryKey: ['detail-post', postId],
    queryFn: () => getDetailPost({
      postId,
      current_profile_id: currentProfile!.id,
    }),
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
      return res;
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
