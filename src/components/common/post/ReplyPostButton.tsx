import React from 'react';
import { ActionIconButton } from '@/components/common/post/ActionIconButton';
import { IPost } from '@/types/components/common/post';
import { featureNotAvailable } from '@/utils';

export function ReplyPostButton({ replies_count }: IPost) {
  return (
    <ActionIconButton
      onPress={featureNotAvailable}
      count={replies_count}
      iconName={replies_count > 0 ? 'message.circle.dots' : 'message.circle'}
    />
  );
}