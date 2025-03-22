import { CameraCapturedPicture } from 'expo-camera';
import React from 'react';
import {
  View, Pressable, Dimensions
} from 'react-native';
import { Image, ImageContentFit } from 'expo-image';
import { Text } from '@/components/ui/Text';

const getImageProperties = (orientation?: number) => {
  const isPortrait = orientation === 6 || orientation === 8;
  return {
    contentFit: (isPortrait ? 'fill' : 'contain') as ImageContentFit,
    aspectRatio: isPortrait ? undefined : 3 / 4,
  };
};

export const PicturePreview = ({
  picture,
  handleRetakePhoto,
  handleUsePhoto,
}: {
  picture: CameraCapturedPicture;
  handleRetakePhoto: () => void;
  handleUsePhoto: () => void;
}) => {
  const { height: screenHeight } = Dimensions.get('window');
  const imageHeight = screenHeight * 0.78;
  const imageProps = getImageProperties(picture.exif?.Orientation);

  return (
    <View className="flex-1 bg-black py-12">
      <View style={{ height: imageHeight }} className="flex-1">
        <Image
          contentFit={imageProps.contentFit}
          source={{ uri: picture.uri }}
          style={{
            aspectRatio: imageProps.aspectRatio,
            width: '100%',
            height: '100%',
          }}
        />
      </View>

      <View className="flex-row justify-between mt-8 mx-10">
        <Pressable
          className="px-5 py-1.5 rounded-full bg-white"
          onPress={handleRetakePhoto}
        >
          <Text className="text-black font-semibold">Retake</Text>
        </Pressable>
        <Pressable
          className="px-5 py-1.5 rounded-full bg-white"
          onPress={handleUsePhoto}
        >
          <Text className="text-black font-semibold">Use photo</Text>
        </Pressable>
      </View>
    </View>
  );
};