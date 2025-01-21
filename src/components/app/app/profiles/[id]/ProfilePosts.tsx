import { Text } from '@/components/ui/Text';
import {
  ActivityIndicator, FlatList, RefreshControl, View 
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { GetPostsParams, useGetPosts } from '@/services/post.service';
import React from 'react';
import { PageLoading } from '@/components/ui/PageLoading';
import { Post } from '@/components/common/Post';
import { NonUndefined } from 'react-hook-form';

type SearchParams = {
  id: string
  type: NonUndefined<GetPostsParams['type']>
};

export function ProfilePosts() {
  const { id: profileId, type = 'posts' } = useLocalSearchParams<SearchParams>();
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
    profile_id: profileId,
    type,
  });

  const [refreshing, setRefreshing] = React.useState(false);
  
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
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
          }
        />
      </View>
    );
  }
  else {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Empty</Text>;
      </View>
    );
  }
}