import React from 'react';
import { LayoutActionButton } from '@/components/common/post/LayoutActionButton';
import Ionicons from '@expo/vector-icons/Ionicons';
import { IPost } from '@/types/components/common/post';
import { featureNotAvailable } from '@/lib/utils';

export function ReplyPostButton({ replies_count }: IPost) {

  return (
    <LayoutActionButton
      onPress={featureNotAvailable}
      count={replies_count}
      icon={(sizeIcon) => <Ionicons name="chatbubble-outline" size={sizeIcon}/>}
    />
  );
}