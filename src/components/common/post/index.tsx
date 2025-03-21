import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { LikePostButton } from '@/components/common/LikePostButton';
import { useRootNameTab } from '@/hooks/useRootNameTab';
import { IPost } from '@/types/components/common/post';
import { ReplyPostButton } from '@/components/common/post/ReplyPostButton';
import { PostImageList } from '@/components/common/post/PostImageList';
import React from 'react';
import { PostAuthorSection } from '@/components/common/post/PostAuthorSection';
import { POST_CONTENT_INDENT } from '@/components/common/post/constants';
import { useQueryClient } from '@tanstack/react-query';

interface PostProps {
  data: IPost;
}

export const Post = ({ data }: PostProps) => {
  const rootNameTab = useRootNameTab();
  const queryClient = useQueryClient();

  const navigateToDetailPost = () => {
    if (!data?.id || !rootNameTab) return;
    queryClient.setQueryData(['detail-post', data.id], data);
    router.push(`/${rootNameTab}/posts/${data.id}`);
  };

  return (
    <Pressable
      onPress={navigateToDetailPost}
      className="py-4 gap-3"
    >
      <PostAuthorSection data={data}/>
      <PostImageList images={data.images} contentContainerStyle={{
        marginTop: data?.content ? 0 : 12,
      }}/>
      <View
        className="flex-row gap-5"
        style={{
          paddingLeft: POST_CONTENT_INDENT,
        }}
      >
        <LikePostButton {...data}/>
        <ReplyPostButton {...data}/>
      </View>
    </Pressable>
  );
};