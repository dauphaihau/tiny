import React, { memo } from 'react';
import { Post } from '@/components/common/post';
import { useLocalSearchParams } from 'expo-router';
import { GetPostsParams, GetPostsTypes } from '@/types/request/post/get-posts';
import { CustomFlatList } from '@/components/common/CustomFlatList';
import { useGetPosts } from '@/services/post/get-posts';

const ITEMS_PER_PAGE = 10;

type SearchParams = {
  type: GetPostsParams['type']
};

interface PostListProps {
  headerHeight: number;
}

const MemoizedPost = memo(Post);

export function PostList(props: PostListProps) {
  const { headerHeight } = props;
  const { type = GetPostsTypes.ALL } = useLocalSearchParams<SearchParams>();
  
  // Track the last scroll position to avoid unnecessary updates
  // const lastScrollYRef = useRef(0);

  const {
    posts,
    isPending,
    refetch,
    isFetchingNextPage,
    hasNextPage,
    isError,
    fetchNextPage,
  } = useGetPosts({
    type,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  // const { setScrollY, updateScrollDirection } = useScrollPositionStore();

  // const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
  //   const currentScrollY = event.nativeEvent.contentOffset.y;
  //   console.log('current-scroll-y', currentScrollY);
  //   if (currentScrollY < 0) return;

  //   // Only update if scroll position has changed significantly to reduce updates
  //   if (Math.abs(currentScrollY - lastScrollYRef.current) > SCROLL_UPDATE_THRESHOLD) {
  //     setScrollY(currentScrollY);
  //     updateScrollDirection(currentScrollY);
  //     lastScrollYRef.current = currentScrollY;
  //   }
  // }, [setScrollY, updateScrollDirection]);

  return (
    <CustomFlatList
      data={posts}
      renderItem={(item) => <MemoizedPost data={item}/>}
      headerHeight={headerHeight}
      isLoading={isPending}
      isError={isError}
      onRefresh={refetch}
      isLoadingMore={isFetchingNextPage}
      hasMoreData={hasNextPage}
      onLoadMore={fetchNextPage}

      // Configure Optimized
      onEndReachedThreshold={0.3}
      removeClippedSubviews={true}
      maxToRenderPerBatch={ITEMS_PER_PAGE}
      initialNumToRender={ITEMS_PER_PAGE}
      windowSize={3}
      updateCellsBatchingPeriod={50}
      // onScroll={handleScroll}
      // scrollEventThrottle={32} // Reduce frequency of scroll events to 30fps instead of 60fps
    />
  );
}