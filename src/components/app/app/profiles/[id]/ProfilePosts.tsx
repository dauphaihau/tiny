import { Text } from '@/components/ui/Text';
import { FlatList, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useGetPostsByProfile } from '@/services/post.service';
import React from 'react';
import { PageLoading } from '@/components/ui/PageLoading';
import { Post } from '@/components/common/post/Post';
import { NonUndefined } from 'react-hook-form';
import { GetPostsByProfileParams } from '@/types/request/post';

type SearchParams = {
  id: string
  type: NonUndefined<GetPostsByProfileParams['type']>
};

export function ProfilePosts() {
  const { id: profileId, type = 'posts' } = useLocalSearchParams<SearchParams>();

  const {
    data,
    isPending,
    hasNextPage,
    fetchNextPage,
  } = useGetPostsByProfile({
    limit: 10,
    page: 1,
    pr_id: profileId,
    type,
  });

  if (isPending) {
    return <PageLoading/>;
  }
  else if (data) {
    return (
      <View>
        <FlatList
          scrollEnabled={false}
          data={data.pages.flatMap((page) => page.data)}
          renderItem={({ item }) => <Post data={item}/>}
          keyExtractor={(item) => item.id.toString()}
          onEndReachedThreshold={0.5}
          onEndReached={() => {
            if (hasNextPage) fetchNextPage();
          }}
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
}