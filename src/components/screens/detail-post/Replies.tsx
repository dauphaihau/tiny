import {
  ActivityIndicator,
  FlatList, RefreshControl, Text, View
} from 'react-native';
import React from 'react';
import { Post } from '@/components/common/post';
import { useGetRepliesPost } from '@/services/post.service';
import { useLocalSearchParams } from 'expo-router';
import { Separator } from '@/components/common/Separator';

export function Replies() {
  const { id: postId } = useLocalSearchParams<{ id: string }>();
  const {
    posts,
    isPending,
    refetch,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useGetRepliesPost(Number(postId));

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  if (isPending) {
    return null;
  }
  else if (posts.length > 0) {
    return (
      <View>
        {
          posts.length > 0 && (
            <View>
              <View>
                <View className="border-[0.4px] border-zinc-300 w-[95%] mx-auto"/>
                <View className="flex-row justify-between py-3.5 px-4">
                  <Text className="font-semibold">Replies</Text>
                  {/*<Text className="text-zinc-400">View activity</Text>*/}
                </View>
              </View>

              <View className="border-[0.4px] border-zinc-300 w-full mx-auto"/>

              <FlatList
                data={posts}
                scrollEnabled={false}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item: post }) => (<Post data={post}/>)}
                ItemSeparatorComponent={() => <Separator/>}
                onEndReachedThreshold={0.5}
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
          )
        }
      </View>
    );
  }
  return null;
}
