import { View } from 'react-native';
import React from 'react';
import { LastMessage } from '@/components/app/app/messages/LastMessage';
import { CustomFlatList } from '@/components/common/CustomFlatList';
import { useHeaderHeight } from '@/hooks/useHeaderHeight';
import { useGetLastMessages } from '@/services/message/get-last-messages';

const ITEMS_PER_PAGE = 10;

export function LastMessageList() {
  const {
    messages,
    isPending,
    refetch,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useGetLastMessages({
    itemsPerPage: ITEMS_PER_PAGE,
  });
  const headerHeight = useHeaderHeight();

  return (
    <View className="flex-1 px-4">
      <CustomFlatList
        data={messages}
        renderItem={(item) => <LastMessage item={item} />}
        isLoading={isPending}
        isError={isError}
        headerHeight={headerHeight + 23}
        onRefresh={refetch}
        isLoadingMore={isFetchingNextPage}
        hasMoreData={hasNextPage}
        onLoadMore={fetchNextPage}
        separatorComponent={null}
        removeClippedSubviews={true}
        maxToRenderPerBatch={ITEMS_PER_PAGE}
        initialNumToRender={ITEMS_PER_PAGE}
        scrollEventThrottle={16}
      />
    </View>
  );
}
