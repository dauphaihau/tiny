import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { UpdateUserDto } from '@/schemas/request/profile';
import { Profile } from '@/types/models/profile';

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
      queryClient.setQueryData(['profile', profile.id], data);
      queryClient.setQueryData(['current-profile'], data);
      return error;
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
  });
}
