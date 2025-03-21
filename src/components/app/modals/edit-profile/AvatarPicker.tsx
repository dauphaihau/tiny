import {
  Image, ImageURISource, Pressable, PressableProps, View
} from 'react-native';
import React from 'react';
import * as ImagePicker from 'expo-image-picker';
import { getAvatarImage } from '@/services/image.service';
import { useGetCurrentProfile } from '@/services/profile.service';
import { Icon } from '@/components/common/Icon';

interface AvatarPickerProps extends PressableProps{
  initialSourceImage?: ImageURISource;
  onImagePicked: (image: ImageURISource) => void;
}

export function AvatarPicker({ onImagePicked, ...props }: AvatarPickerProps) {
  const { data: currentProfile } = useGetCurrentProfile();
  const [newSourceImage, setNewSourceImage] = React.useState<ImageURISource | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      const pickedImage = { uri: result.assets[0].uri };
      setNewSourceImage(pickedImage);
      onImagePicked(pickedImage);
    }
  };

  return (
    <Pressable
      onPress={pickImage}
      className="ml-4 mb-4 self-start rounded-full"
      {...props}
    >
      <Image
        source={newSourceImage || getAvatarImage(currentProfile?.avatar)}
        className="size-20 rounded-full"
        resizeMethod="resize"
      />
      <View className="absolute justify-center items-center bg-black/30 size-20 rounded-full">
        <Icon name="camera" size={20} color="white"/>
      </View>
    </Pressable>
  );
}