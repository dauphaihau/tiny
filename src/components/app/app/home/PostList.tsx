import {
  ActivityIndicator,
  FlatList, RefreshControl, View
} from 'react-native';
import { useGetPosts } from '@/services/post.service';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import React from 'react';
import { Post } from '@/components/common/post';
import { useLocalSearchParams } from 'expo-router';
import { NoResults } from '@/components/common/NoResults';
import { Separator } from '@/components/common/Separator';
import { NonUndefined } from 'react-hook-form';
import { GetPostsParams } from '@/types/request/post';

type SearchParams = {
  type: NonUndefined<GetPostsParams['type']> | 'default'
};

export function PostList() {
  const { type } = useLocalSearchParams<SearchParams>();
  const {
    posts,
    isPending,
    refetch,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useGetPosts({
    type: type === 'default' ? undefined : type,
  });
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  
  if (isPending) return <LoadingScreen/>;   
  if (!posts.length) return <NoResults/>;   
  
  return (
    <View>
      <FlatList
        data={posts}
        renderItem={({ item }) => <Post data={item}/>}
        keyExtractor={(item) => item.id.toString()}
        onEndReachedThreshold={0.5}
        ItemSeparatorComponent={() => <Separator/>}
        onEndReached={() => {
          if (hasNextPage) fetchNextPage();
        }}
        ListFooterComponent={() => (
          <View className='mb-24'>
            {isFetchingNextPage ?
              (
                <View className="py-4">
                  <ActivityIndicator />
                </View>
              ) :
              null}
            <Separator/>
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />
    </View>

  );
}