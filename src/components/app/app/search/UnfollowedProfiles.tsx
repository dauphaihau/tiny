import { ActivityIndicator, FlatList, View } from 'react-native';
import { useGetUnfollowedProfiles } from '@/services/profile.service';
import { UnfollowProfileItem } from './UnfollowProfileItem';
import React from 'react';

export function UnfollowedProfiles() {
  const {
    profiles,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetUnfollowedProfiles();

  return (
    <View className="flex-1">
      <FlatList
        data={profiles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <UnfollowProfileItem
            id={item.id}
            username={item.username ?? ''}
            first_name={item.first_name}
            followers={item.followers_count}
            avatar={item.avatar}
          />
        )}
        ListFooterComponent={
          isFetchingNextPage ?
            <ActivityIndicator size='small' className='my-8' /> :
            <View className='mb-24'/>
        }
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
} 