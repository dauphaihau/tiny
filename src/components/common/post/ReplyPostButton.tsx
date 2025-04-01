import React from 'react';
import { ActionIconButton } from '@/components/common/post/ActionIconButton';
import { IPost } from '@/types/components/common/post';

interface ReplyPostButtonProps {
  replies_count: IPost['replies_count'];
  onPress?: () => void;
}

export function ReplyPostButton({ replies_count, onPress }: ReplyPostButtonProps) {
  return (
    <ActionIconButton
      onPress={onPress}
      count={replies_count}
      iconName={replies_count > 0 ? 'message.circle.dots' : 'message.circle'}
    />
  );
}