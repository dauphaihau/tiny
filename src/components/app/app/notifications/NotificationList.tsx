import {
  View, FlatList, ActivityIndicator, RefreshControl 
} from 'react-native';
import { useGetNotifications } from '@/services/notification.service';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import React from 'react';
import { Separator } from '@/components/common/Separator';
import { NotificationItem } from '@/components/app/app/notifications/NotificationItem';
import { useLocalSearchParams } from 'expo-router';
import { NoResults } from '@/components/common/NoResults';
import { INotification } from '@/types/request/notification/get-notifications';

export function NotificationList() {
  const { type = 'all' } = useLocalSearchParams<{ type: string }>();
  
  const {
    notifications,
    isPending,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useGetNotifications({ type });

  const renderItem = ({ item }: { item: INotification }) => {
    return (
      <NotificationItem data={item}/>
    );
  };

  if (isPending) return <LoadingScreen/>;
  if (!notifications.length) return <NoResults/>;

  console.log('notifications', notifications);

  return (
    <FlatList
      data={notifications}
      keyExtractor={(item) => item?.id?.toString()}
      renderItem={renderItem}
      ItemSeparatorComponent={() => <Separator/>}
      onEndReached={() => {
        if (hasNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={() => (
        <View className="mb-24">
          <Separator/>
          {isFetchingNextPage ?
            (
              <View className="py-8">
                <ActivityIndicator/>
              </View>
            ) :
            null}
        </View>
      )}
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={refetch}
        />
      }
    />
  );
}