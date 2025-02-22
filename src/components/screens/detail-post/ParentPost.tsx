import {
  View, Pressable, Image
} from 'react-native';
import { router } from 'expo-router';
import { Avatar } from '@/components/common/Avatar';
import { parsePostCreatedAt } from '@/lib/day';
import { ScrollView } from 'react-native-gesture-handler';
import { getImage } from '@/services/image.service';
import React from 'react';
import { LikePostButton } from '@/components/common/LikePostButton';
import { useRootNameTab } from '@/hooks/useRootNameTab';
import { Text } from '@/components/ui/Text';
import { ReplyPostButton } from '@/components/common/post/ReplyPostButton';
import { IPost } from '@/types/components/common/post';

interface ParentPostProps {
  post: IPost
}

export function ParentPost({ post }: ParentPostProps) {
  const rootNameTab = useRootNameTab();

  function navigateToProfile() {
    if (!rootNameTab || !post.profile) return;
    router.push(`/${rootNameTab}/profiles/${post.profile.id}`);
  }

  return (
    <View className="relative">
      <View className="py-5">
        <View className="gap-3 px-4">
          <View className="flex-row items-center gap-3">
            <Pressable onPress={navigateToProfile}>
              <Avatar path={post?.profile?.avatar}/>
            </Pressable>
            <Text onPress={navigateToProfile} className="font-semibold">{post?.profile?.username}</Text>
            <Text className="font-medium text-zinc-400">{parsePostCreatedAt(post?.created_at)}</Text>
          </View>
          <Text>{post?.content}</Text>
        </View>

        {
          post?.images && post.images.length > 0 && (
            <View className="pl-4 mt-4">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 16 }}
              >
                {
                  post.images.map(item => (
                    <Image
                      key={item.image_path}
                      source={getImage(item.image_path)}
                      className="size-52 rounded-md"
                    />
                  ))
                }
              </ScrollView>
            </View>
          )
        }
        <View className="pl-4 flex-row gap-5 mt-4">
          <LikePostButton {...post}/>
          <ReplyPostButton {...post}/>
        </View>
      </View>
    </View>
  );
}
