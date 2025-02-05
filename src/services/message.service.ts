import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Post } from '@/types/models/post';
import { useGetCurrentProfile } from '@/services/profile.service';
import { Profile } from '@/types/models/profile';
import { Database } from '@/types/database.types';
import { GetLastMessagesParams, GetMessagesParams } from '@/types/request/message';

const getMessages = async (params: GetMessagesParams) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(`and(sender_id.eq.${params.current_profile_id},receiver_id.eq.${params.receiver_id}),and(sender_id.eq.${params.receiver_id},receiver_id.eq.${params.current_profile_id})`)
    .order('created_at', { ascending: false });

  if (error) {
    console.log('error', error);
    throw new Error();
  }
  return {
    data,
    nextPage: data?.length ? params.page + 1 : undefined,
  };
};

const getLastMessages = async (params: GetLastMessagesParams) => {
  const { data, error } = await supabase.rpc('get_last_messages', {
    current_profile_id: params.current_profile_id,
  });

  if (error) {
    console.log('error', error);
    throw new Error();
  }
  data.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  return {
    data,
    nextPage: data?.length ? params.page + 1 : undefined,
  };
};


// hooks

export function useSendMessage() {
  return useMutation({
    mutationKey: ['send-message'],
    mutationFn: async (body: Database['public']['Tables']['messages']['Insert']) => {
      console.log('body', body);
      return supabase
        .from('messages')
        .insert(body)
        .select('id')
        .single<Pick<Post, 'id'>>()
      ;
    },
  });
}

export function useGetMessages(receiver_id: Profile['id']) {
  const { data: currentProfile } = useGetCurrentProfile();

  return useInfiniteQuery({
    queryKey: ['get-messages', receiver_id],
    queryFn: ({ pageParam = 1 }) => getMessages({
      current_profile_id: currentProfile!.id,
      receiver_id,
      page: pageParam,
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
}

export function useGetLastMessages() {
  const { data: currentProfile } = useGetCurrentProfile();

  return useInfiniteQuery({
    enabled: !!currentProfile?.id,
    queryKey: ['get-last-messages', currentProfile!.id],
    queryFn: ({ pageParam = 1 }) => getLastMessages({
      current_profile_id: currentProfile!.id,
      page: pageParam,
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
}