import React from 'react';
import { FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { ProfileItem } from '@/components/app/app/search/ProfileItem';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { NoResults } from '@/components/common/NoResults';
import { useSearchProfiles } from '@/services/profile.service';

type ProfilesListProps = {
  searchTerm: string;
};

export function ProfilesList({ searchTerm }: ProfilesListProps) {
  const {
    profiles,
    hasNextPage,
    fetchNextPage,
    isLoading,
    isFetchingNextPage,
    refetch,
  } = useSearchProfiles({
    searchTerm,
  });

  if (isLoading) return <LoadingScreen />;
  if (!profiles.length) return <NoResults />;

  return (
    <FlatList
      data={profiles}
      keyExtractor={(item, index) => `${item.id}-${index}`}
      renderItem={({ item }) => (
        <ProfileItem
          id={item.id}
          username={item.username}
          first_name={item.first_name}
          avatar={item.avatar}
          is_following={item.is_following}
        />
      )}
      onEndReached={() => {
        if (hasNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={() => (
        isFetchingNextPage ? <ActivityIndicator className='my-8' /> : null
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