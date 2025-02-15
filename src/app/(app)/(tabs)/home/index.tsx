import {
  ActivityIndicator,
  FlatList, RefreshControl, View
} from 'react-native';
import { useGetPosts } from '@/services/post.service';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import React from 'react';
import { Post } from '@/components/common/post';
import { PostTabs } from '@/components/app/app/home/PostTabs';
import { useLocalSearchParams } from 'expo-router';
import { GetPostsParams } from '@/types/request/post';
import { NonUndefined } from 'react-hook-form';
import { NoResults } from '@/components/common/NoResults';

type SearchParams = {
  type: NonUndefined<GetPostsParams['type']> | 'default'
};

export default function HomeScreen() {
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

  return (
    <View className='flex-1'>
      <PostTabs/>
      <View className="border-[0.4px] border-zinc-300 w-full -mt-1.5"/>
      {
        isPending ?
          <LoadingScreen/> :
          posts.length > 0 ?
            (
              <View>
                <FlatList
                  data={posts}
                  renderItem={({ item }) => <Post data={item}/>}
                  keyExtractor={(item) => item.id.toString()}
                  onEndReachedThreshold={0.5}
                  onEndReached={() => {
                    if (hasNextPage) fetchNextPage();
                  }}
                  ListFooterComponent={
                    isFetchingNextPage ?
                      <ActivityIndicator size='small' className='my-8' /> :
                      <View className='mb-24'/>
                  }
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }
                />
              </View>
            ) :
            (<NoResults/>)
      }
    </View>
  );
};
