import { ActivityIndicator, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import React, { memo } from 'react';
import { Post } from '@/components/common/post';
import { GetPostsByProfileParams, PostsByProfileType } from '@/types/request/post/get-posts-by-profile';
import { Text } from '@/components/ui/Text';
import { CustomFlatList } from '@/components/common/CustomFlatList';
import { DETAIL_PROFILE_CONFIG } from '@/components/shared-screens/detail-profile/constants';
import { useGetPostsByProfile } from '@/services/post/get-posts-by-profile';

type SearchParams = {
  id: string
  type: GetPostsByProfileParams['type']
};

const MemoizedPost = memo(Post);

export function ProfilePosts() {
  const {
    id: profileId,
    type = PostsByProfileType.ROOT,
  } = useLocalSearchParams<SearchParams>();

  const {
    posts,
    isPending,
    isFetchingNextPage,
    isError,
  } = useGetPostsByProfile({
    targetProfileId: profileId,
    type,
  });

  return (
    <CustomFlatList
      data={posts}
      renderItem={(item) => <MemoizedPost data={item}/>}
      ListHeaderComponent={null}
      scrollEnabled={false}
      loadingComponent={
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      }
      emptyComponent={
        <View className="flex-1 items-center justify-center">
          <Text className="text-muted-foreground">No posts available</Text>
        </View>
      }
      isLoading={isPending}
      isError={isError}
      isLoadingMore={isFetchingNextPage}

      // Configure Optimized
      initialNumToRender={DETAIL_PROFILE_CONFIG.ITEMS_PER_PAGE}
      windowSize={DETAIL_PROFILE_CONFIG.ITEMS_PER_PAGE}
      maxToRenderPerBatch={DETAIL_PROFILE_CONFIG.ITEMS_PER_PAGE}
    />
  );
}