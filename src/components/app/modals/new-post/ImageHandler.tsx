import { ImageURISource, Alert, Linking } from 'react-native';
import React, { useState } from 'react';
import { router } from 'expo-router';
import { CameraCapturedPicture, useCameraPermissions } from 'expo-camera';
import { useCameraStore } from '@/stores/camera.store';

interface ImageHandlerProps {
  children: (props: {
    handleCameraPress: () => Promise<void>;
    handleImagesPicked: (images: ImageURISource[]) => void;
    sourceImages: ImageURISource[] | undefined;
    removeImage: (idx: number) => void;
  }) => React.ReactNode;
}

export function ImageHandler({ children }: ImageHandlerProps) {
  const { setOnCapture } = useCameraStore();
  const [sourceImages, setSourceImages] = useState<ImageURISource[]>();
  const [permission, requestPermission] = useCameraPermissions();

  const handleCapture = (picture: CameraCapturedPicture) => {
    if (!picture) return;
    
    setSourceImages(prev => [...(prev || []), {
      uri: picture.uri,
      width: picture.width,
      height: picture.height,
    }]);
  };

  const handleImagesPicked = (images: ImageURISource[]) => {
    setSourceImages(prev => [...images, ...(prev || [])]);
  };

  const handleCameraPress = async () => {
    const mustOpenSettings = !permission?.canAskAgain && !permission?.granted;

    if (permission?.granted) {
      setOnCapture(handleCapture);
      router.push('/modals/camera');
      return;
    }

    Alert.alert(
      'Allow Tiny to access your camera',
      'Tiny use your camera to do things like help you take photos when posting.',
      [
        {
          text: mustOpenSettings ? 'Open settings' : 'Grant permission',
          onPress: async () => {
            if (mustOpenSettings) {
              Linking.openSettings();
            }
            else {
              const { granted } = await requestPermission();
              if (granted) {
                setOnCapture(handleCapture);
                router.push('/modals/camera');
              }
            }
          },
        },
        { text: 'Cancel' },
      ]
    );
  };

  const removeImage = (idx: number) => {
    if (sourceImages) {
      setSourceImages(sourceImages.filter((_item, index) => index !== idx));
    }
  };

  return children({
    handleCameraPress,
    handleImagesPicked,
    sourceImages,
    removeImage,
  });
} 