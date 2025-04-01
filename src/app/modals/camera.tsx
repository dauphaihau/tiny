import React, { useState, useRef } from 'react';
import {
  View, Pressable, StyleSheet
} from 'react-native';
import {
  CameraCapturedPicture,
  CameraType, CameraView, useCameraPermissions
} from 'expo-camera';
import { router } from 'expo-router';
import { PicturePreview } from '@/components/app/modals/camera/PicturePreview';
import { useCameraStore } from '@/stores/camera.store';
import { Button } from '@/components/ui/Button';

const ICON_SIZE = 30;

export default function CameraScreen() {
  const { onCapture } = useCameraStore();
  const [permission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const cameraRef = useRef<CameraView | null>(null);
  const [picture, setPicture] = useState<CameraCapturedPicture>();

  if (!permission) {
    return <View/>;
  }

  const takePicture = async () => {
    if (!cameraRef.current) return;
    const takedPhoto = await cameraRef.current.takePictureAsync({
      quality: 1,
      base64: false,
      exif: true,
    });
    setPicture(takedPhoto);
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const handleRetakePhoto = () => setPicture(undefined);

  const handleUsePhoto = async () => {
    if (!picture || !onCapture) {
      console.error('No picture or onCapture function provided');
      return;
    }
    onCapture(picture);
    router.back();
  };

  if (picture) {
    return (
      <PicturePreview
        picture={picture}
        handleRetakePhoto={handleRetakePhoto}
        handleUsePhoto={handleUsePhoto}
      />
    );
  }

  return (
    <View className="flex-1">
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing={facing}
        ref={cameraRef}
        videoStabilizationMode="auto"
        responsiveOrientationWhenOrientationLocked={true}
      >
        <View className="absolute bottom-0 left-0 right-0">
          <View className="flex-row justify-around items-center px-5 py-20 bg-transparent">
            <Button
              iconWeight="bold"
              onPress={router.back}
              icon="close"
              iconClassName="text-white"
              variant="none"
            />
            <Pressable
              className="size-[60px] rounded-full border-[5px] border-white justify-center items-center"
              onPress={takePicture}
            >
              <View className="size-[44px] rounded-full bg-white"/>
            </Pressable>
            <Button
              onPress={toggleCameraFacing}
              icon="camera.rotate"
              iconSize={ICON_SIZE}
              iconClassName="text-white"
              variant="none"
            />
          </View>
        </View>
      </CameraView>
    </View>
  );
}
