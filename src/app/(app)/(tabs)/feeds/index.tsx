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

const params = {
  limit: 10,
  page: 1,
};

export default function FeedsPage() {
  const {
    data,
    isPending,
    refetch,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useGetPosts(params);

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

  if (isPending) {
    return <PageLoading/>;
  }
  else if (data) {
    return (
      <View>
        <PostTabs/>
        <FlatList
          data={data.pages.flatMap((page) => page.data)}
          renderItem={({ item }) => <Post data={item}/>}
          keyExtractor={(item) => item.id.toString()}
          onEndReachedThreshold={0.5}
          onEndReached={() => {
            if (hasNextPage) fetchNextPage();
          }}
          ListFooterComponent={isFetchingNextPage ? <ActivityIndicator size='small' className='my-8' /> : null}
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
  else {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Empty</Text>
      </View>
    );
  }
};
