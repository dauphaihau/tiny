import { Pressable } from 'react-native';
import React from 'react';
import * as ImagePicker from 'expo-image-picker';
import { ImageURISource } from 'react-native';
import { LIMIT_IMAGES_PER_POST } from '@/constants/post';
import { COLOR_ICON_BUTTON, SIZE_ICON_BUTTON } from '@/components/app/modals/new-post/constants';
import { Icon } from '@/components/common/Icon';

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
    <Pressable onPress={pickImage}>
      <Icon
        name="photo"
        size={SIZE_ICON_BUTTON}
        color={COLOR_ICON_BUTTON}
      />
    </Pressable>
  );
}