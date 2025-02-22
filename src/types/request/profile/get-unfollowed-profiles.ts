import { Database } from '@/types/database.types';

export type UnfollowedProfilesProps = {
  pageSize?: number;
};

// Extract the return type from the Supabase RPC function
export type UnfollowedProfile = Database['public']['Functions']['get_unfollowed_profiles']['Returns'][0];
