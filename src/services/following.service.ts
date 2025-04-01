import { useGetCurrentProfile } from '@/services/profile.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/types/models/profile';

export function useToggleFollow(profileId: Profile['id']) {
  const { data: currentProfile } = useGetCurrentProfile();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: ['toggle-follow', profileId],
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
    onSuccess: () => {
      // Invalidate the profile cache to refresh data in both components
      queryClient.invalidateQueries({ queryKey: ['profile', profileId] });
    },
  });
}
