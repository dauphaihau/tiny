import {
  ActivityIndicator,
  FlatList, RefreshControl, View
} from 'react-native';
import { useGetPosts } from '@/services/post.service';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import React from 'react';
import { Post } from '@/components/common/post';
import { router, useLocalSearchParams } from 'expo-router';
import { GetPostsParams } from '@/types/request/post';
import { NonUndefined } from 'react-hook-form';
import { NoResults } from '@/components/common/NoResults';
import { Tabs } from '@/components/common/Tabs';
import { SafeAreaView } from 'react-native-safe-area-context';

const tabs = [
  { label: 'For you', value: 'default' },
  { label: 'Following', value: 'following' },
];

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

  const onPressTab = (value: string) => {
    router.setParams({ type: value });
  };

  return (
    <SafeAreaView className='flex-1'>
      <View className="pt-8"/>
      <Tabs
        tabs={tabs}
        onPressTab={onPressTab}
      />
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
    </SafeAreaView>
  );
};
