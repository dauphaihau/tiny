import { FlatList, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useGetPostsByProfile } from '@/services/post.service';
import React from 'react';
import { Post } from '@/components/common/post';
import { NonUndefined } from 'react-hook-form';
import { GetPostsByProfileParams } from '@/types/request/post';

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
  } = useGetPostsByProfile({
    pr_id: profileId,
    type,
  });

  if (isPending) {
    return null;
  }
  else if (posts.length > 0) {
    return (
      <View>
        <FlatList
          data={posts}
          scrollEnabled={false}
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
    return null;
  }
}