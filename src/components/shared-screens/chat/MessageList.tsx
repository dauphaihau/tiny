import React, { useCallback } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Profile } from '@/types/models/profile';
import { Message } from '@/components/shared-screens/chat/Message';
import { useHeaderHeight } from '@/hooks/useHeaderHeight';
import { HEADER_PADDING_BOTTOM } from '@/components/layout/constants';
import { CustomFlatList } from '@/components/common/CustomFlatList';
import { MESSAGES_PER_PAGE, useGetMessages } from '@/services/message/get-messages';
import { View } from 'react-native';

interface MessageItem {
  id: number;
  content: string;
  created_at: string;
  sender_id: string;
  receiver_id: string;
}

type SearchParams = {
  profile_id: Profile['id']
};

const PADDING_BOTTOM_OFFSET = 30;

export function MessageList() {
  const headerHeight = useHeaderHeight();
  const { profile_id } = useLocalSearchParams<SearchParams>();
  const {
    messages,
    isPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
  } = useGetMessages({
    otherProfileId: profile_id,
  });

  const renderMessage = useCallback((message: MessageItem) => {
    const index = messages?.findIndex(m => m.id === message.id) ?? -1;
    return (
      <Message
        data={message}
        previousMessage={messages?.[index + 1]}
        nextMessage={messages?.[index - 1]}
      />
    );
  }, [messages]);

  return (
    <CustomFlatList
      data={messages ?? []}
      renderItem={renderMessage}
      isLoading={isPending}
      isLoadingMore={isFetchingNextPage}
      isError={isError}
      hasMoreData={hasNextPage}
      headerHeight={headerHeight}
      separatorComponent={null}
      emptyComponent={<View/>}
      onLoadMore={fetchNextPage}
      inverted
      removeClippedSubviews
      maxToRenderPerBatch={MESSAGES_PER_PAGE / 2}
      windowSize={5}
      initialNumToRender={MESSAGES_PER_PAGE}
      contentContainerStyle={{
        paddingBottom: headerHeight + HEADER_PADDING_BOTTOM + PADDING_BOTTOM_OFFSET,

        // Push messages to the bottom
        flexGrow: 1,
        justifyContent: 'flex-end',
      }}
      onEndReachedThreshold={0.3}
    />
  );
}
