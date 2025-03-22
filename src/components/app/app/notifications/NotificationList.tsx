import { useGetNotifications } from '@/services/notification.service';
import React, { memo } from 'react';
import { NotificationItem } from '@/components/app/app/notifications/NotificationItem';
import { useLocalSearchParams } from 'expo-router';
import { NotificationType } from '@/types/request/notification/get-notifications';
import { CustomFlatList } from '@/components/common/CustomFlatList';

type SearchParams = {
  type: NotificationType
};

interface NotificationsListProps {
  headerHeight: number
}

const MemoizedNoti = memo(NotificationItem);

export function NotificationList({ headerHeight }: NotificationsListProps) {
  const { type = NotificationType.ALL } = useLocalSearchParams<SearchParams>();

  const {
    notifications,
    isPending,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useGetNotifications({ type });

  return (
    <CustomFlatList
      data={notifications}
      renderItem={(item) => <MemoizedNoti data={item}/>}
      isLoading={isPending}
      isError={isError}
      isLoadingMore={isFetchingNextPage}
      hasMoreData={hasNextPage}
      headerHeight={headerHeight}
      onRefresh={refetch}
      onLoadMore={fetchNextPage}
      onEndReachedThreshold={0.4}
    />
  );
}