import React, { useCallback, useMemo } from 'react';
import {
  FlatList,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { Post } from '@/components/common/post';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { NoResults } from '@/components/common/NoResults';
import { useSearchPosts } from '@/services/post.service';
import { IPost } from '@/types/components/common/post';

type PostsListProps = {
  searchTerm: string;
  isLatest?: boolean;
};

const PAGE_SIZE = 10;

export function PostsList({ searchTerm, isLatest }: PostsListProps) {
  const {
    posts,
    isPending,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useSearchPosts({
    searchTerm,
    latest: isLatest,
    pageSize: PAGE_SIZE,
  });

  const renderItem = useCallback(({ item }: { item: IPost }) => (
    <Post data={item} />
  ), []);

  const keyExtractor = useCallback((item: IPost) =>
    item.id.toString()
  , []);

  const handleEndReached = useCallback(() => {
    if (hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage]);

  const ListFooterComponent = useMemo(() => (
    isFetchingNextPage ? <ActivityIndicator className='my-8' /> : null
  ), [isFetchingNextPage]);

  if (isPending) return <LoadingScreen />;
  if (!posts.length) return <NoResults />;

  return (
    <FlatList
      data={posts}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={ListFooterComponent}
      removeClippedSubviews={true}
      windowSize={5}
      maxToRenderPerBatch={PAGE_SIZE}
      initialNumToRender={PAGE_SIZE}
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={refetch}
        />
      }
    />
  );
}