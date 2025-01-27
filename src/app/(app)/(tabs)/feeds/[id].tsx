import {
  router, Stack, useLocalSearchParams, useNavigation 
} from 'expo-router';
import { useGetDetailPost } from '@/services/post.service';
import React from 'react';
import { RefreshControl, TouchableOpacity, View } from 'react-native';
import { ReplyInput } from '@/components/app/app/feeds/[id]/ReplyInput';
import { SubPosts } from '@/components/app/app/feeds/[id]/SubPosts';
import { Text } from '@/components/ui/Text';
import { PageLoading } from '@/components/ui/PageLoading';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ScrollView } from 'react-native-gesture-handler';
import { ParentPost } from '@/components/app/app/feeds/[id]/ParentPost';

export default function DetailPostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const {
    data: post,
    error: errorGetDetailPost,
    isPending,
    refetch,
  } = useGetDetailPost(Number(id));

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const navigationState = navigation.getState();

  return (
    <View>
      <Stack.Screen
        options={{
          headerTitle: navigationState && navigationState?.routes?.length > 2 ? 'Reply' : 'Post',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back-outline" size={21}/>
            </TouchableOpacity>
          ),
        }}
      />

      {isPending && <PageLoading/>}
      {
        errorGetDetailPost && (
          <View className="flex-1 items-center justify-center">
            <Text>Unknown error</Text>
          </View>
        )
      }
      {
        post && (
          <View className="h-full">
            <ScrollView
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
              }
            >
              <ParentPost data={post}/>
              {
                post && post.sub_posts.length > 0 && (
                  <View>
                    <View className="border-[0.4px] border-zinc-300 w-[95%] mx-auto"/>
                    <View className="flex-row justify-between py-3 px-4">
                      <Text className="font-semibold">
                        Replies
                      </Text>
                      <Text className="text-zinc-400">
                        View activity
                      </Text>
                    </View>
                  </View>
                )
              }
              <SubPosts/>
            </ScrollView>
            <ReplyInput/>
          </View>
        )
      }
    </View>
  );
}
