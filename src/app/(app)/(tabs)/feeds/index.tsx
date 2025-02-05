import { Text } from '@/components/ui/Text';
import {
  ActivityIndicator,
  FlatList, RefreshControl, View
} from 'react-native';
import { useGetPosts } from '@/services/post.service';
import { PageLoading } from '@/components/ui/PageLoading';
import React from 'react';
import { Post } from '@/components/common/post/Post';
import { supabase } from '@/lib/supabase';
import { PostTabs } from '@/components/app/app/feeds/PostTabs';
import { useLocalSearchParams } from 'expo-router';
import { GetPostsParams } from '@/types/request/post';
import { NonUndefined } from 'react-hook-form';

type SearchParams = {
  type: NonUndefined<GetPostsParams['type']> | 'default'
};

export default function FeedsPage() {
  const { type } = useLocalSearchParams<SearchParams>();
  const {
    data,
    isPending,
    refetch,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useGetPosts({
    limit: 10,
    page: 1,
    type: type === 'default' ? undefined : type,
  });

  const [refreshing, setRefreshing] = React.useState(false);

  React.useEffect(() => {
    const postChannel = supabase
      .channel('posts')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts',
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(postChannel);
    };
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  return (
    <View>
      <PostTabs/>
      <View className="border-[0.4px] border-zinc-300 w-full -mt-1.5"/>
      {
        isPending ?
          <PageLoading/> :
          data ?
            (
              <View>
                <FlatList
                  data={data.pages.flatMap((page) => page.data)}
                  renderItem={({ item }) => <Post data={item}/>}
                  keyExtractor={(item) => item.id.toString()}
                  onEndReachedThreshold={0.5}
                  onEndReached={() => {
                    if (hasNextPage) fetchNextPage();
                  }}
                  ListFooterComponent={
                    isFetchingNextPage ?
                      <ActivityIndicator size='small' className='my-8' /> :
                      null
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
            (
              <View className="h-full items-center justify-center">
                <Text>No results</Text>
              </View>
            )
      }
    </View>
  );
};
