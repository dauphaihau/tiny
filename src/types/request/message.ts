import { Profile } from '@/types/models/profile';
import { GetListParams, PaginationMetadata } from '@/types/request/common';
import { Database } from '@/types/database.types';

export interface GetMessagesParams extends GetListParams{
  current_profile_id: Profile['id'];
  other_profile_id: Profile['id'];
  page: number;
}

export interface GetLastMessagesParams extends GetListParams {
  currentProfileId: Profile['id'];
  page: number;
}

export type ILastMessage = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  other_profile: {
    id: string;
    avatar: string;
    username: string;
    first_name: string;
  };
};

export interface GetLastMessagesResponse {
  messages: ILastMessage[];
  pagination: PaginationMetadata;
}

export type IMessage = Database['public']['Tables']['messages']['Row'];
