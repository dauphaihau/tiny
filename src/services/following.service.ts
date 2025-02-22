import { useGetCurrentProfile } from '@/services/profile.service';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/types/models/profile';

export function useToggleFollow(profileId: Profile['id']) {
  const { data: currentProfile } = useGetCurrentProfile();
  return useMutation({
    mutationKey: ['toggle-follow'],
    mutationFn: async () => {
      const { error } = await supabase
        .from('follows')
        .insert({
          follower_id: currentProfile!.id,
          followed_id: profileId,
        })
      ;
      if (error) return error;   
      return undefined;
    },
  });
}
