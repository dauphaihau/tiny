import {
  ActivityIndicator, FlatList, RefreshControl, View
} from 'react-native';
import { useGetUnfollowedProfiles } from '@/services/profile.service';
import { UnfollowProfileItem } from './UnfollowProfileItem';
import React, { useCallback, useMemo } from 'react';
import { UnfollowedProfile } from '@/types/request/profile/get-unfollowed-profiles';

const PAGE_SIZE = 20;

export function UnfollowedProfileList() {
  const {
    profiles,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useGetUnfollowedProfiles({
    pageSize: PAGE_SIZE,
  });

  const renderItem = useCallback(({ item }: { item: UnfollowedProfile }) => (
    <UnfollowProfileItem{...item}/>
  ), []);

  const keyExtractor = useCallback((item: UnfollowedProfile) => item.id, []);

  const ListFooterComponent = useMemo(() => (
    <View className='mb-24'>
      {
        isFetchingNextPage ?
          <ActivityIndicator size="small" className="my-8"/> :
          null
      }
    </View>
  ), [isFetchingNextPage]);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <View className="flex-1">
      <FlatList
        data={profiles}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListFooterComponent={ListFooterComponent}
        ListHeaderComponent={() => <View className="mt-4"/>}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        initialNumToRender={PAGE_SIZE}
        maxToRenderPerBatch={PAGE_SIZE}
        windowSize={5}
        removeClippedSubviews={true}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={refetch}
          />
        }
      />
    </View>
  );
}