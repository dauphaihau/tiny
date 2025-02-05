import { Profile } from '@/types/models/profile';

export interface GetMessagesParams {
  current_profile_id: Profile['id'];
  receiver_id: Profile['id'];
  page: number;
}

export interface GetLastMessagesParams {
  current_profile_id: Profile['id'];
  page: number;
}
