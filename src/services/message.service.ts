import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useGetCurrentProfile } from '@/services/profile.service';
import { Profile } from '@/types/models/profile';
import { Database } from '@/types/database.types';
import { GetLastMessagesParams, GetMessagesParams, IMessage } from '@/types/request/message';
import React from 'react';

const getMessages = async (params: GetMessagesParams) => {
  const start = (params.page - 1) * params.limit;
  const end = start + params.limit - 1;

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(`and(sender_id.eq.${params.current_profile_id},receiver_id.eq.${params.receiver_id}),and(sender_id.eq.${params.receiver_id},receiver_id.eq.${params.current_profile_id})`)
    .order('created_at', { ascending: false })
    .range(start, end);

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
  // data.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
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
      console.log('');
      return supabase
        .from('messages')
        .insert(body)
      ;
    },
  });
}

export function useGetMessages(receiver_id: Profile['id']) {
  const LIMIT = 20;
  const [messages, setMessages] = React.useState<IMessage[]>([]);
  const { data: currentProfile } = useGetCurrentProfile();

  const query = useInfiniteQuery({
    enabled: true,
    queryKey: ['get-messages', currentProfile?.id, receiver_id],
    queryFn: ({ pageParam = 1 }) => getMessages({
      current_profile_id: currentProfile!.id,
      receiver_id,
      page: pageParam,
      limit: LIMIT,
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  React.useEffect(() => {
    if (query.data) {
      setMessages(query.data.pages.flatMap((page) => page.data));
    }
  }, [query.data]);

  React.useEffect(() => {
    const messageChannel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          const newMessage = payload.new as IMessage;
          if (
            (newMessage.receiver_id === receiver_id && newMessage.sender_id === currentProfile?.id) ||
          (newMessage.receiver_id === currentProfile?.id && newMessage.sender_id === receiver_id)
          ) {
            setMessages((prevMessages) => [payload.new as IMessage, ...prevMessages]);
          }
        }
      )
      .subscribe((status) => {
        console.log('🟢 Message channel subscription status:', status);
      });

    return () => {
      supabase.removeChannel(messageChannel);
    };
  }, [currentProfile?.id, receiver_id]);

  return {
    ...query,
    messages,
  };
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