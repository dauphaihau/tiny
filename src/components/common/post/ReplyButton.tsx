import React from 'react';
import { LayoutActionButton } from '@/components/common/post/LayoutActionButton';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { PostResponse } from '@/types/request/post';

interface ReplyButtonProps {
  postData: PostResponse;
}

export function ReplyButton({ postData }: ReplyButtonProps) {
  function navigateDetailPost() {
    if(!postData?.id) return;
    router.push({
      pathname: '/feeds/[id]',
      params: {
        id: postData.id.toString(),
        autoFocus: 'true',
      },
    });
  }

  return (
    <LayoutActionButton
      onPress={navigateDetailPost}
      icon={(sizeIcon) => <Ionicons name="chatbox-outline" size={sizeIcon}/>}
    />
  );
}