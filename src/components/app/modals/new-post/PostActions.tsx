import { View } from 'react-native';
import React from 'react';
import { POST_CONTENT_INDENT } from './constants';
import { PickImageButton } from './PickImageButton';
import { ImageURISource } from 'react-native';
import { featureNotAvailable } from '@/utils';
import { Button } from '@/components/ui/Button';

interface PostActionsProps {
  onImagesPicked: (images: ImageURISource[]) => void;
  onCameraPress: () => void;
}

export function PostActions({ onImagesPicked, onCameraPress }: PostActionsProps) {
  return (
    <View
      style={{
        paddingLeft: POST_CONTENT_INDENT,
      }}
      className="flex-row gap-6 mt-4 relative"
    >
      <PickImageButton onImagesPicked={onImagesPicked}/>
      <Button
        icon='camera'
        iconClassName="text-muted-foreground"
        onPress={onCameraPress}
        variant="none"
      />
      <Button
        icon='mic'
        iconClassName="text-muted-foreground"
        onPress={featureNotAvailable}
        variant="none"
      />
      <Button
        icon='location'
        iconClassName="text-muted-foreground"
        onPress={featureNotAvailable}
        variant="none"
      />
    </View>
  );
} 