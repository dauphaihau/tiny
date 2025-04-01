import React from 'react';
import { Post } from '@/components/common/post';
import { useSearchPosts } from '@/services/post.service';
import { CustomFlatList } from '@/components/common/CustomFlatList';
import { NoResults } from '@/components/common/NoResults';

type PostsListProps = {
  searchTerm: string;
  isLatest?: boolean;
  headerHeight: number
};

const PAGE_SIZE = 10;

export function PostList({ searchTerm, isLatest, headerHeight }: PostsListProps) {
  const {
    posts,
    isPending,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    isError,
  } = useSearchPosts({
    searchTerm,
    latest: isLatest,
    pageSize: PAGE_SIZE,
  });

  return (
    <CustomFlatList
      data={posts}
      headerHeight={headerHeight}
      renderItem={(item) => <Post data={item}/>}
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