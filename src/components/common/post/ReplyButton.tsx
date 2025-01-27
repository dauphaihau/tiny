import React from 'react';
import { PostContext } from '@/components/common/post/Post';
import { LayoutActionButton } from '@/components/common/post/LayoutActionButton';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export function ReplyButton() {
  const postData = React.useContext(PostContext);

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