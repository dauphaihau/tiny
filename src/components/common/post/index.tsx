import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { LikePostButton } from '@/components/common/LikePostButton';
import { useRootNameTab } from '@/hooks/useRootNameTab';
import { IPost } from '@/types/components/common/post';
import { ReplyPostButton } from '@/components/common/post/ReplyPostButton';
import { PostImageList } from '@/components/common/post/PostImageList';
import React, { useEffect, useMemo } from 'react';
import { PostAuthorSection } from '@/components/common/post/PostAuthorSection';
import { POST_CONTENT_INDENT } from '@/components/common/post/constants';
import { useQueryClient } from '@tanstack/react-query';
import { usePostRealtime } from '@/hooks/usePostRealtime';

interface PostProps {
  data: IPost;
  key?: string; // Allow parent components to provide a key
}

export const Post = ({ data }: PostProps) => {
  const rootNameTab = useRootNameTab();
  const queryClient = useQueryClient();

  // Use memoized identity for consistent reference
  const postIdentity = useMemo(() => ({ ...data }), [data]);

  // Use realtime hook with the memoized post to maintain stable identity
  const realtimeStatPost = usePostRealtime(postIdentity);

  // Always keep the cache updated with the latest post data
  useEffect(() => {
    if (realtimeStatPost?.id) {
      queryClient.setQueryData(['detail-post', realtimeStatPost.id], realtimeStatPost);
    }
  }, [realtimeStatPost, queryClient]);

  const navigateToDetailPost = () => {
    if (!realtimeStatPost?.id || !rootNameTab) return;

    // Navigate to detail screen
    router.push(`/${rootNameTab}/posts/${realtimeStatPost.id}`);
  };

  const handleReplyPress = () => {
    if (!data?.id || !rootNameTab) return;

    // Navigate to detail screen with focus parameter to auto-focus the reply form
    router.push(`/${rootNameTab}/posts/${data?.id}?focus=reply`);
  };

  return (
    <Pressable
      onPress={navigateToDetailPost}
      className="py-4 gap-3"
    >
      <PostAuthorSection data={data}/>
      <PostImageList
        images={data.images}
        contentContainerStyle={{
          marginTop: data?.content ? 0 : 12,
        }}
      />
      <View
        className="flex-row gap-5"
        style={{
          paddingLeft: POST_CONTENT_INDENT,
        }}
      >
        <LikePostButton {...realtimeStatPost}/>
        <ReplyPostButton onPress={handleReplyPress} {...realtimeStatPost}/>
      </View>
    </Pressable>
  );
};