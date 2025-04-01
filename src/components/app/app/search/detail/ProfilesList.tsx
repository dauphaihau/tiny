import React from 'react';
import { ProfileItem } from '@/components/app/app/search/ProfileItem';
import { useSearchProfiles } from '@/services/profile.service';
import { CustomFlatList } from '@/components/common/CustomFlatList';
import { NoResults } from '@/components/common/NoResults';

type ProfilesListProps = {
  searchTerm: string;
  headerHeight: number
};

export function ProfilesList({ searchTerm, headerHeight }: ProfilesListProps) {
  const {
    profiles,
    hasNextPage,
    fetchNextPage,
    isPending,
    isError,
    isFetchingNextPage,
    refetch,
  } = useSearchProfiles({
    searchTerm,
  });

  return (
    <CustomFlatList
      data={profiles}
      headerHeight={headerHeight}
      renderItem={(item) => (
        <ProfileItem
          id={item.id}
          username={item.username}
          first_name={item.first_name}
          avatar={item.avatar}
          is_following={item.is_following}
        />
      )}
      isLoading={isPending}
      isError={isError}
      isLoadingMore={isFetchingNextPage}
      hasMoreData={hasNextPage}
      onRefresh={refetch}
      onLoadMore={fetchNextPage}
      emptyComponent={<NoResults />}
    />
  );
}