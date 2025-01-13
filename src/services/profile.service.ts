import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/superbase';
import { UpdateUserDto } from '@/schemas/request/profile';
import { Profile } from '@/schemas/models/profile';

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
        .select('*')
        .eq('id', userId)
        .limit(1)
        .single();
      if (error) throw error;
      return data;
    },
  });
}

export function useGetProfileById(id: Profile['id']) {
  return useQuery({
    queryKey: ['profile', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .limit(1)
        .single();
      if (error) throw error;
      return data;
    },
  });
}
