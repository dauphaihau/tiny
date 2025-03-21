import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useGetCurrentProfile } from '@/services/profile.service';
import { Profile } from '@/types/models/profile';
import { GetMessagesParams, IMessage } from '@/types/request/message';
import React from 'react';
import { PaginationMetadata } from '@/types/request/common';

export const MESSAGES_PER_PAGE = 20;

interface GetMessagesResponse {
  messages: IMessage[];
  pagination: PaginationMetadata;
}

const getMessages = async (params: GetMessagesParams) => {
  const { data, error } = await supabase.rpc('get_messages', {
    current_profile_id: params.current_profile_id,
    other_profile_id: params.other_profile_id,
    page_number: params.page,
    items_per_page: params.itemsPerPage || MESSAGES_PER_PAGE,
  });

  if (error) {
    throw new Error(`supabase.rpc get_messages ${error.message}`);
  }
  
  const typedData = data as unknown as GetMessagesResponse;
  
  return {
    data: typedData.messages,
    nextPage: typedData.pagination.has_next ? params.page + 1 : undefined,
  };
};

type UseGetMessagesParams = {
  otherProfileId: Profile['id'];
  itemsPerPage?: number;
};

export function useGetMessages({
  otherProfileId,
  itemsPerPage = MESSAGES_PER_PAGE,
}: UseGetMessagesParams) {
  const [messages, setMessages] = React.useState<IMessage[]>([]);
  const { data: currentProfile } = useGetCurrentProfile();

  const query = useInfiniteQuery({
    enabled: !!currentProfile?.id,
    queryKey: ['get-messages', currentProfile?.id, otherProfileId],
    queryFn: ({ pageParam = 1 }) => getMessages({
      current_profile_id: currentProfile!.id,
      other_profile_id: otherProfileId,
      page: pageParam,
      itemsPerPage,
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
    if (!currentProfile?.id) return;

    const currentProfileChannel = supabase
      .channel(`room:${currentProfile.id}-${otherProfileId}`)
      .on(
        'broadcast',
        { event: 'new_message' },
        (payload) => {
          const newMessage = payload.payload;
          setMessages((prevMessages) => [newMessage, ...prevMessages]);
        }
      )
      .subscribe();

    const receiverChannel = supabase
      .channel(`room:${otherProfileId}-${currentProfile.id}`)
      .on(
        'broadcast',
        { event: 'new_message' },
        (payload) => {
          const newMessage = payload.payload;
          setMessages((prevMessages) => [newMessage, ...prevMessages]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(currentProfileChannel);
      supabase.removeChannel(receiverChannel);
    };
  }, [currentProfile?.id, otherProfileId]);

  return {
    ...query,
    messages,
  };
}

export default getMessages; 