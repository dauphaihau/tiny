import {
  View, TextInput, Platform, ImageURISource,
  ScrollView, KeyboardAvoidingView
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useRef, useState } from 'react';
import { AuthWrapper } from '@/components/common/AuthWrapper';
import { Avatar } from '@/components/common/Avatar';
import { useGetCurrentProfile } from '@/services/profile.service';
import { Text } from '@/components/ui/Text';
import { createPost, createPostImages } from '@/services/post.service';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { uploadImage } from '@/services/image.service';
import { useNavigation } from '@react-navigation/native';
import { PickImageButton } from '@/components/app/modals/new-post/PickImageButton';
import { ImagePreviews } from '@/components/app/modals/new-post/ImagePreviews';
import { BackScreenButton } from '@/components/layout/header/BackScreenButton';
import { supabase } from '@/lib/supabase';
import { compressImage } from '@/utils/compress-image';
import { featureNotAvailable } from '@/utils';
import { CameraCapturedPicture } from 'expo-camera';
import { useCameraStore } from '@/stores/camera.store';
import { MAX_WIDTH_IMAGE, MAX_HEIGHT_IMAGE, MAX_SIZE_IN_MB } from '@/constants/post';
import * as FileSystem from 'expo-file-system';
import { COLOR_ICON_BUTTON, POST_CONTENT_INDENT, SIZE_ICON_BUTTON } from '@/components/app/modals/new-post/constants';
import { Icon } from '@/components/common/Icon';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function NewPostScreen() {
  const { setOnCapture } = useCameraStore();
  const [content, setContent] = useState('');
  const inputRef = useRef<TextInput>(null);
  const { data: currentProfile } = useGetCurrentProfile();
  const { rootNameTab } = useLocalSearchParams();
  const [sourceImages, setSourceImages] = useState<ImageURISource[]>();
  const navigation = useNavigation();
  const [contentHeight, setContentHeight] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [isSubmitting, setIsSubmit] = useState(false);
  const insets = useSafeAreaInsets();

  React.useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <BackScreenButton variant="text" />
      ),
    });
  }, [navigation]);

  // Effect to keep the TextInput focused
  React.useEffect(() => {
    const focusInput = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    // Focus on mount
    focusInput();

    // Refocus whenever the component gains focus (e.g., after navigating back)
    const unsubscribe = navigation.addListener('focus', focusInput);

    // Clean up the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, [navigation]); // Add navigation as a dependency if it's used inside.

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

  const handleCameraPress = () => {
    setOnCapture(handleCapture);
    router.push('/modals/camera');
  };

  const removeImage = (idx: number) => {
    if (sourceImages) {
      setSourceImages(sourceImages.filter((_item, index) => index !== idx));
    }
  };

  const onSubmit = async () => {
    try {
      if (!currentProfile?.id) throw new Error('profile id be undefined');
      setIsSubmit(true);
      router.back();

      //  wait modal to close
      setTimeout(() => {
        Toast.show({
          type: 'createPost',
          autoHide: false,
          props: {
            isLoading: true,
            message: 'Posting...',
          },
        });
      }, 100);

      const postCreated = await createPost({
        profile_id: currentProfile.id,
        content: content.trim() ?? null,
      });

      // Handle image uploads with compression
      let imagePaths: string[] = [];
      let imageMetadata: { path: string, width?: number, height?: number }[] = [];
      if (sourceImages && sourceImages?.length > 0) {
        const processedImages = sourceImages.map(item => ({
          ...item,
          width: item.width,
          height: item.height,
        }));

        const processedUris = await Promise.all(
          processedImages.map(async (item) => {
            let newWidth = item.width as number;
            let newHeight = item.height as number;
            let newUri = item.uri as string;

            // Limit image size
            const aspectRatio = newWidth / newHeight;

            if (newWidth > MAX_WIDTH_IMAGE) {
              newWidth = MAX_WIDTH_IMAGE;
              newHeight = newWidth / aspectRatio;
            }
            if (newHeight > MAX_HEIGHT_IMAGE) {
              newHeight = MAX_HEIGHT_IMAGE;
              newWidth = newHeight * aspectRatio;
            }
            if (newHeight !== item.height || newWidth !== item.width) {
              const resized = await compressImage(
                item.uri as string,
                {
                  width: newWidth,
                  height: newHeight,
                }
              );
              newUri = resized.uri;
            }

            // Update image width and height
            item.width = Math.round(newWidth);
            item.height = Math.round(newHeight);

            //  Compress image if needed
            let compressQuality = 1;
            let fileSizeInMB = 0;
            const fileInfo = await FileSystem.getInfoAsync(newUri, { size: true });

            if (fileInfo.exists) {
              fileSizeInMB = fileInfo.size / (1024 * 1024);
            }
            while (fileSizeInMB > MAX_SIZE_IN_MB && compressQuality > 0.1) {
              compressQuality -= 0.1; // Reduce quality step by step

              const compressed = await compressImage(
                newUri,
                { quality: compressQuality }
              );

              newUri = compressed.uri;

              const newFileInfo = await FileSystem.getInfoAsync(newUri, { size: true });
              if (newFileInfo.exists) {
                fileSizeInMB = newFileInfo.size / (1024 * 1024);
              }
              else {
                break; // Avoid infinite loop if size is not available
              }
            }

            return newUri;
          })
        );

        if (processedUris.some(uri => uri === undefined)) {
          throw new Error('Error processing images');
        }

        // Then upload processed images
        imagePaths = await Promise.all(
          processedUris.map(uri => uploadImage('posts', uri!))
        );

        // Use processedImages instead of sourceImages for metadata
        imageMetadata = imagePaths.map((path, index) => ({
          path,
          width: processedImages[index].width,
          height: processedImages[index].height,
        }));

        const postImagesBody = imagePaths.map((imagePath, index) => ({
          post_id: postCreated.id,
          image_path: imagePath,
          width: processedImages[index].width,
          height: processedImages[index].height,
        }));
        await createPostImages(postImagesBody);
      }

      const newPost = {
        id: postCreated.id,
        content,
        parent_id: null,
        created_at: postCreated.created_at,
        images: imageMetadata.map(({ path, width, height }) => ({
          image_path: path,
          width,
          height,
        })),
        profile: {
          id: currentProfile.id,
          username: currentProfile.username,
          avatar: currentProfile.avatar,
          first_name: currentProfile.first_name,
        },
        likes_count: 0,
        replies_count: 0,
        is_liked: false,
      };

      await supabase.channel('posts').send({
        type: 'broadcast',
        event: 'new_post',
        payload: newPost,
      });

      Toast.show({
        type: 'createPost',
        props: {
          isLoading: false,
          message: 'Posted',
          detailPostHref: `/${rootNameTab}/posts/${postCreated.id}`,
        },
      });
    }
    catch (error) {
      console.log('Error create post:', error);
      Toast.show({
        type: 'error',
        props: {
          message: 'Created post failed',
        },
      });
    }
    finally {
      setIsSubmit(false);
    }
  };

  const disabledSubmit = isSubmitting || (!content.trim() && !sourceImages?.length);

  return (
    <AuthWrapper>
      {/* <View className="flex-1"> */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 72 : 0} // Adjust this value as needed
      >
        <View style={{ flex: 1 }}>
          <View className="" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

            {/* ScrollView area for content */}
            <View style={{ flex: 1 }}>
              <ScrollView
                style={{ paddingTop: 20 }}
                scrollEnabled={contentHeight + 30 > containerHeight}
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="always"
                keyboardDismissMode="none"
                onLayout={(event) => {
                  setContainerHeight(event.nativeEvent.layout.height);
                }}
              >
                <View
                  onLayout={(event) => {
                    setContentHeight(event.nativeEvent.layout.height);
                  }}
                >
                  <View className="flex-row gap-4 pl-3">
                    <View>
                      <Avatar path={currentProfile?.avatar} className="size-12" />
                    </View>
                    <View className="flex-1">
                      <Text className="font-semibold text-lg leading-none">{currentProfile?.username}</Text>
                      <Input
                        variant="none"
                        size="none"
                        scrollEnabled={false}
                        autoFocus
                        editable={!isSubmitting}
                        placeholder="What's new"
                        autoCapitalize="none"
                        ref={inputRef}
                        onSubmitEditing={() => {
                          inputRef.current?.focus();
                        }}
                        onBlur={() => {
                          if (!isSubmitting) {
                            inputRef.current?.focus();
                          }
                        }}
                        onChangeText={(val) => setContent(val)}
                        multiline
                        numberOfLines={10}
                        className="px-0"
                        style={{ lineHeight: 19 }}
                      />
                    </View>
                  </View>

                  <ImagePreviews
                    images={sourceImages || []}
                    onRemoveImage={removeImage}
                    contentContainerStyle={{
                      paddingLeft: POST_CONTENT_INDENT,
                      paddingRight: 12,
                    }}
                  />

                  {/* Post Actions */}
                  <View
                    style={{
                      paddingLeft: POST_CONTENT_INDENT,
                    }}
                    className="flex-row gap-7 mt-4 relative"
                  >
                    <PickImageButton onImagesPicked={handleImagesPicked} />
                    <Icon name="camera" size={SIZE_ICON_BUTTON} color={COLOR_ICON_BUTTON} onPress={handleCameraPress} />
                    <Icon name="mic" size={SIZE_ICON_BUTTON} color={COLOR_ICON_BUTTON} onPress={featureNotAvailable} />
                    <Icon name="location" size={SIZE_ICON_BUTTON} color={COLOR_ICON_BUTTON} onPress={featureNotAvailable} />
                  </View>
                </View>
              </ScrollView>
            </View>

            <View 
              className="px-3 py-2" 
              style={{ 
                paddingBottom: insets.top, // avoid keyboard
              }}
            >
              <View className="flex-row items-center justify-between">
                <Text className="text-md text-zinc-400 font-medium">Anyone can reply & quote</Text>
                <Button
                  onPress={onSubmit}
                  disabled={disabledSubmit}
                  radius="full"
                  size="md"
                  className="px-5"
                >
                  <Text>Post</Text>
                </Button>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
      {/* </View> */}
    </AuthWrapper>
  );
}