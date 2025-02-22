import { ActivityIndicator, FlatList, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useGetPostsByProfile } from '@/services/post.service';
import React from 'react';
import { Post } from '@/components/common/post';
import { NonUndefined } from 'react-hook-form';
import { GetPostsByProfileParams } from '@/types/request/post';
import { Separator } from '@/components/common/Separator';

type SearchParams = {
  id: string
  type: NonUndefined<GetPostsByProfileParams['type']>
};

export function ProfilePosts() {
  const { id: profileId, type = 'posts' } = useLocalSearchParams<SearchParams>();

  const {
    posts,
    isPending,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetPostsByProfile({
    pr_id: profileId,
    type,
  });

  if (isPending || !posts.length) {
    return null;
  }
  return (
    <View>
      <FlatList
        data={posts}
        scrollEnabled={false}
        renderItem={({ item }) => <Post data={item}/>}
        ItemSeparatorComponent={() => <Separator/>}
        keyExtractor={(item) => item.id.toString()}
        ListFooterComponent={() => (
          <View className="mb-24">
            <Separator/>
            {isFetchingNextPage ?
              (
                <View className="py-8">
                  <ActivityIndicator/>
                </View>
              ) :
              null}
          </View>
        )}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (hasNextPage) fetchNextPage();
        }}
      />
    </View>
  );
}