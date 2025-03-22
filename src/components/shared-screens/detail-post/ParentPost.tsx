import {
  View, Pressable
} from 'react-native';
import { router } from 'expo-router';
import { Avatar } from '@/components/common/Avatar';
import { parsePostCreatedAt } from '@/utils/parse-post-created-at';
import React from 'react';
import { LikePostButton } from '@/components/common/LikePostButton';
import { useRootNameTab } from '@/hooks/useRootNameTab';
import { Text } from '@/components/ui/Text';
import { ReplyPostButton } from '@/components/common/post/ReplyPostButton';
import { IPost } from '@/types/components/common/post';
import { PostImages } from '@/components/shared-screens/detail-post/PostImages';

interface ParentPostProps {
  post: IPost;
}

export function ParentPost({ post }: ParentPostProps) {
  const rootNameTab = useRootNameTab();

  function navigateToProfile() {
    if (!rootNameTab || !post.profile) return;
    router.push(`/${rootNameTab}/profiles/${post.profile.id}`);
  }

  return (
    <View className="relative">
      <View className="py-5 gap-4">
        <View className="gap-3 px-4">
          <View className="flex-row items-center gap-1">
            <Pressable onPress={navigateToProfile} className="mr-2">
              <Avatar path={post?.profile?.avatar} className="size-10"/>
            </Pressable>
            <Pressable onPress={navigateToProfile}>
              <Text className="font-semibold text-lg">{post?.profile?.username}</Text>
            </Pressable>
            <Text className="font-medium text-zinc-400">·</Text>
            <Text className="font-medium text-zinc-400">{parsePostCreatedAt(post?.created_at)}</Text>
          </View>
          {post?.content ? <Text selectable className="text-lg">{post.content}</Text> : null}
        </View>
        <PostImages images={post.images}/>
        <View className="pl-4 flex-row gap-5">
          <LikePostButton {...post}/>
          <ReplyPostButton {...post}/>
        </View>
      </View>
    </View>
  );
}