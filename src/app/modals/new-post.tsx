import {
  View, TextInput, KeyboardAvoidingView, Platform, Pressable, ImageURISource, Image
} from 'react-native';
import { Link, router, Stack } from 'expo-router';
import React, { useRef, useState } from 'react';
import { AuthWrapper } from '@/components/common/AuthWrapper';
import { Feather } from '@expo/vector-icons';
import { Avatar } from '@/components/common/Avatar';
import { useGetCurrentProfile } from '@/services/profile.service';
import { Text } from '@/components/ui/Text';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { useCreatePost, useCreatePostImages } from '@/services/post.service';
import { Button } from '@/components/ui/Button';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from '@expo/vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { uploadImage } from '@/services/image.service';

const sizeIcon = 18;
const colorIcon = 'gray';

export default function NewPostScreen() {
  const [content, setContent] = useState('');
  const inputRef = useRef<TextInput>(null);
  const { data: dataUser } = useGetCurrentProfile();
  const { mutateAsync: createPost, isPending } = useCreatePost();
  const { mutateAsync: createPostImages } = useCreatePostImages();
  const [sourceImages, setSourceImages] = useState<ImageURISource[]>();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: ['images'],
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      const sources = result.assets.map(item => ({ uri: item.uri }));
      setSourceImages(sources);
    }
  };

  const removeImage = (idx: number) => {
    if (sourceImages) {
      setSourceImages(sourceImages.filter((_item, index) => index !== idx));
    }
  };

  const onSubmit = async () => {
    try {
      if (!dataUser?.id) throw new Error('user id be undefined');

      const responseCreatePost = await createPost({
        profile_id: dataUser.id,
        content,
      });
      if (responseCreatePost.error) throw new Error(responseCreatePost.error.message);

      if (sourceImages && sourceImages?.length > 0) {
        const imagePaths = await Promise.all(
          sourceImages.map(item => uploadImage('posts', item.uri))
        );
        const postImagesBody = imagePaths.map(imagePath => ({
          post_id: responseCreatePost.data.id,
          image_path: imagePath,
        }));
        const response = await createPostImages(postImagesBody);
        if (response.error) throw new Error(response.error.message);
      }
      router.back();
      Toast.show({
        type: 'createdPost',
        props: {
          postId: responseCreatePost.data.id,
          message: 'Posted',
        },
      });
    }
    catch (error) {
      console.log('error', error);
      Toast.show({
        type: 'error',
        props: {
          message: 'Created post failed',
        },
      });
    }
  };

  return (
    <AuthWrapper>
      <View>
        <Stack.Screen
          options={{
            headerLeft: () => <Link href="../">Cancel</Link>,
          }}
        />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <SafeAreaView className="p-5">
          <View className="h-full">
            <View className="flex-row gap-2">
              <View className="w-[10%]">
                <Avatar path={dataUser?.avatar}/>
              </View>
              <View className="w-[90%]">
                <Text className="font-semibold">{dataUser?.username}</Text>
                <TextInput
                  autoFocus
                  editable={!isPending}
                  placeholder="What's new"
                  ref={inputRef}
                  onChangeText={(val) => setContent(val)}
                  multiline
                  numberOfLines={10}
                />

                {
                  sourceImages && sourceImages.length > 0 &&
                  <View className="flex-row gap-4 mt-4">
                    {
                      sourceImages.map((item, index) => (
                        <View key={index}>
                          <Image source={item} className="w-40 h-40 rounded-md"/>
                          <Ionicons
                            onPress={() => removeImage(index)}
                            className="bg-black/50 rounded-full absolute right-2 top-2 p-1"
                            style={{ color: 'white' }}
                            name="close"
                            size={10}
                            color={colorIcon}
                          />
                        </View>
                      ))
                    }
                  </View>
                }
                <View className="flex-row gap-7 mt-4">
                  <Pressable onPress={pickImage}>
                    <Ionicons name="images-outline" size={sizeIcon} color={colorIcon}/>
                  </Pressable>
                  <Feather name="camera" size={sizeIcon} color={colorIcon}/>
                  <SimpleLineIcons name="microphone" size={sizeIcon} color={colorIcon}/>
                  <Ionicons name="location-outline" size={sizeIcon} color={colorIcon}/>
                </View>
              </View>
            </View>

            <View className="absolute bottom-[25%] w-full">
              <View className="flex-row items-center justify-between">

                <Text className="text-md text-zinc-400">
                  Anyone can reply & quote
                </Text>

                <Button
                  disabled={isPending}
                  onPress={() => onSubmit()}
                  className="rounded-full"
                >
                  <Text>Post</Text>
                </Button>

              </View>
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>

    </AuthWrapper>
  );
}
