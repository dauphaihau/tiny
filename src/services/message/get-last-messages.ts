import { supabase } from '@/lib/supabase';
import { GetLastMessagesParams, GetLastMessagesResponse } from '@/types/request/message';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useGetCurrentProfile } from '@/services/profile.service';
import { ILastMessage } from '@/types/request/message';
import React from 'react';

const getLastMessages = async (params: GetLastMessagesParams) => {
  const { data, error } = await supabase.rpc('get_last_messages', {
    current_profile_id: params?.currentProfileId,
    items_per_page: params?.itemsPerPage,
    page_number: params?.page,
  });

  if (error) {
    throw new Error(`supabase.rpc get_last_messages ${error.message}`);
  }
  return data as unknown as GetLastMessagesResponse;
};

export function useGetLastMessages(params: Pick<GetLastMessagesParams, 'itemsPerPage'>) {
  const { data: currentProfile } = useGetCurrentProfile();
  const [messages, setMessages] = React.useState<ILastMessage[]>([]);
  const [isInitialSetMessages, setIsInitialSetMessages] = React.useState(true);

  const query = useInfiniteQuery({
    enabled: !!currentProfile?.id,
    queryKey: ['get-last-messages'],
    queryFn: ({ pageParam = 1 }) => getLastMessages({
      currentProfileId: currentProfile!.id,
      page: pageParam,
      itemsPerPage: params?.itemsPerPage,
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.pagination;
      return pagination.has_next ? pagination.current_page + 1 : undefined;
    },
  });

  React.useEffect(() => {
    if (query.data) {
      setMessages(query.data.pages.flatMap((page) => page.messages));
      setIsInitialSetMessages(false);
    }
  }, [query.data]);

  React.useEffect(() => {
    if (!currentProfile?.id) return;

    const messageChannel = supabase
      .channel(`direct_message:${currentProfile.id}`)
      .on(
        'broadcast',
        { event: 'new_message' },
        (payload) => {
          setMessages(prevMessages => {
            const newMessage = payload.payload;
            const otherProfileId = newMessage.sender_id === currentProfile.id ?
              newMessage.receiver_id :
              newMessage.sender_id;

            // Find if there's an existing conversation
            const existingIndex = prevMessages.findIndex(
              msg => msg.other_profile.id === otherProfileId
            );

            if (existingIndex >= 0) {
              // Update existing conversation
              const updatedMessages = [...prevMessages];
              updatedMessages[existingIndex] = {
                ...updatedMessages[existingIndex],
                content: newMessage.content,
                created_at: newMessage.created_at,
                sender_id: newMessage.sender_id,
              };
              // Move to top
              updatedMessages.unshift(updatedMessages.splice(existingIndex, 1)[0]);
              return updatedMessages;
            }

            return prevMessages;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messageChannel);
    };
  }, [currentProfile?.id]);

  return {
    ...query,
    messages,
    isPending: query.isPending || isInitialSetMessages,
  };
} 