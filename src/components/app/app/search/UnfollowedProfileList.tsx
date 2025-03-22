import { useGetUnfollowedProfiles } from '@/services/profile.service';
import { UnfollowProfileItem } from './UnfollowProfileItem';
import React from 'react';
import { CustomFlatList } from '@/components/common/CustomFlatList';

const PAGE_SIZE = 20;

interface UnfollowedProfileListProps {
  headerHeight: number;
}

export function UnfollowedProfileList({ headerHeight }: UnfollowedProfileListProps) {
  const {
    profiles,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isPending,
    isError,
  } = useGetUnfollowedProfiles({
    pageSize: PAGE_SIZE,
  });

  return (
    <CustomFlatList
      data={profiles}
      renderItem={(item) => <UnfollowProfileItem {...item}/>}
      headerHeight={headerHeight + 16}
      hasMoreData={hasNextPage}
      isLoading={isPending}
      isError={isError}
      isLoadingMore={isFetchingNextPage}
      onLoadMore={fetchNextPage}
      separatorComponent={null}
      onRefresh={refetch}
      initialNumToRender={PAGE_SIZE}
      maxToRenderPerBatch={PAGE_SIZE}
      windowSize={5}
    />
  );
}