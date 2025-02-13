import { Profile } from '@/types/models/profile';
import { GetListParams } from '@/types/request/common';
import { Database } from '@/types/database.types';

export interface GetMessagesParams extends GetListParams{
  current_profile_id: Profile['id'];
  receiver_id: Profile['id'];
  page: number;
}

export interface GetLastMessagesParams {
  current_profile_id: Profile['id'];
  page: number;
}

export type IMessage = Database['public']['Tables']['messages']['Row'];

export type ILastMessage = Database['public']['Functions']['get_last_messages']['Returns'][0];