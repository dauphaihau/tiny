import {
  useMutation, useQuery, useQueryClient, useInfiniteQuery 
} from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { UpdateUserDto } from '@/schemas/request/profile';
import { Profile } from '@/types/models/profile';
import React, { useCallback } from 'react';
import { UnfollowedProfilesProps } from '@/types/request/profile/get-unfollowed-profiles';
import { SearchProfilesParams } from '@/types/request/profile/search-profiles';
import { useFocusEffect } from 'expo-router';

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { data: profile } = useGetCurrentProfile();

  return useMutation({
    mutationKey: ['update-profile'],
    mutationFn: async (body: UpdateUserDto) => {
      if (!profile?.id) throw new Error('profile id be undefined');
      const { name, ...resBody } = body;
      const updateBody = {
        ...resBody,
        first_name: name,
      };

      const { error, data } = await supabase
        .from('profiles')
        .update(updateBody)
        .eq('id', profile.id)
        .select()
        .single();
      if (error) {
        throw new Error(error.message);
      }
      queryClient.setQueryData(['profile', profile.id], data);
      queryClient.setQueryData(['current-profile'], { ...profile, ...data });
    },
  });
}

export function useGetCurrentProfile() {
  return useQuery({
    queryKey: ['current-profile'],
    queryFn: async () => {
      const response = await supabase.auth.getSession();
      const userId = response?.data?.session?.user?.user_metadata?.sub;

      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          first_name,
          avatar,
          bio,
          username,
          followers_count: follows!followed_id(count),
          following_count: follows!follower_id(count)
        `)
        .eq('id', userId)
        .limit(1)
        .single();
      if (error) throw error;
      return {
        ...data,
        followers_count: data.followers_count[0].count ?? 0,
        following_count: data.following_count[0].count ?? 0,
      };
    },
  });
}

export function useGetProfileById(id: Profile['id']) {
  const { data: currentProfile } = useGetCurrentProfile();
  return useQuery({
    enabled: !!currentProfile?.id,
    queryKey: ['profile', id],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_profile_by_id', {
        current_profile_id: currentProfile!.id,
        profile_id: id,
      });
      if (error) throw error;
      return data[0];
    },
    refetchOnMount: true,
  });
}

export function useGetUnfollowedProfiles(props?: UnfollowedProfilesProps) {
  const { data: currentProfile } = useGetCurrentProfile();
  const pageSize = props?.pageSize ?? 20;
  const queryClient = useQueryClient();

  useFocusEffect(
    useCallback(() => {
      queryClient.invalidateQueries({ queryKey: ['profiles-not-followed'] });
    }, [queryClient])
  );

  const query = useInfiniteQuery({
    enabled: !!currentProfile?.id,
    queryKey: ['profiles-not-followed'],
    queryFn: async ({ pageParam = 1 }) => {
      if (!currentProfile?.id) throw new Error('Current profile ID is undefined');

      const { data, error } = await supabase.rpc('get_unfollowed_profiles', {
        current_profile_id: currentProfile.id,
        items_per_page: pageSize,
        page_number: pageParam,
      });

      if (error) throw error;

      return {
        profiles: data,
        nextPage: data.length === pageSize ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });

  return {
    ...query,
    profiles: query.data?.pages.flatMap(page => page.profiles) ?? [],
  };
}

export function useSearchProfiles({
  searchTerm,
  pageSize = 15,
}: SearchProfilesParams) {
  const { data: currentProfile } = useGetCurrentProfile();
  const queryClient = useQueryClient();

  const query = useInfiniteQuery({
    enabled: !!currentProfile?.id && !!searchTerm,
    queryKey: ['search-profiles', searchTerm, pageSize],
    queryFn: async ({ pageParam = 1 }) => {
      if (!currentProfile?.id) throw new Error('Current profile ID is undefined');

      const { data, error } = await supabase.rpc('search_profiles', {
        search_term: searchTerm,
        current_profile_id: currentProfile.id,
        items_per_page: pageSize,
        page_number: pageParam,
      });

      if (error) throw error;

      return {
        profiles: data,
        nextPage: data.length === pageSize ? pageParam + 1 : undefined,
        pageParam,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
    gcTime: 0, // Disable cache retention
  });

  // Reset query when search term changes
  React.useEffect(() => {
    return () => {
      queryClient.removeQueries({ queryKey: ['search-profiles', searchTerm] });
    };
  }, [searchTerm, queryClient]);

  return {
    ...query,
    profiles: query.data?.pages.flatMap(page => page.profiles) ?? [],
  };
}
