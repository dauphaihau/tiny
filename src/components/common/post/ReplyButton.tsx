import React from 'react';
import { LayoutActionButton } from '@/components/common/post/LayoutActionButton';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRootNameTab } from '@/hooks/useRootNameTab';
import { IPost } from '@/types/components/common/post';

interface ReplyButtonProps {
  post: IPost;
}

export function ReplyButton({ post }: ReplyButtonProps) {
  const rootNameTab = useRootNameTab();

  const navigateDetailPost = () => {
    if(!post?.id || !rootNameTab) return;
    router.push({
      pathname: `/${rootNameTab}/posts/[id]`,
      params: {
        id: post.id,
        autoFocus: 'true',
      },
    });
  };

  return (
    <LayoutActionButton
      onPress={navigateDetailPost}
      icon={(sizeIcon) => <Ionicons name="chatbox-outline" size={sizeIcon}/>}
    />
  );
}