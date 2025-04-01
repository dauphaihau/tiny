import React from 'react';
import * as ImagePicker from 'expo-image-picker';
import { ImageURISource } from 'react-native';
import { LIMIT_IMAGES_PER_POST } from '@/constants/post';
import { Button } from '@/components/ui/Button';

interface PickImageButtonProps {
  onImagesPicked: (sources: ImageURISource[]) => void;
}

export function PickImageButton({
  onImagesPicked,
}: PickImageButtonProps) {
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: ['images'],
      quality: 1,
      selectionLimit: LIMIT_IMAGES_PER_POST,
      exif: false,
      base64: false,
      allowsEditing: false,
      videoMaxDuration: 0,
      presentationStyle: ImagePicker.UIImagePickerPresentationStyle.FULL_SCREEN,
      aspect: undefined,
      videoQuality: undefined,
      orderedSelection: true,
    });

    if (!result.canceled) {
      onImagesPicked(result.assets);
    }
  };

  return (
    <Button
      onPress={pickImage}
      icon='photo'
      iconClassName="text-muted-foreground"
      variant="none"
    />
  );
}