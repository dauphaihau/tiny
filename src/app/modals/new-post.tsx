import {
  View, TextInput, KeyboardAvoidingView, Platform, Pressable, ImageURISource, Image,
  ScrollView
} from 'react-native';
import {
  Link, router, useLocalSearchParams
} from 'expo-router';
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
import { useNavigation } from '@react-navigation/native';

const sizeIcon = 18;
const colorIcon = 'gray';

export default function NewPostScreen() {
  const [content, setContent] = useState('');
  const inputRef = useRef<TextInput>(null);
  const { data: dataUser } = useGetCurrentProfile();
  const { rootNameTab } = useLocalSearchParams();
  const { mutateAsync: createPost, isPending } = useCreatePost();
  const { mutateAsync: createPostImages } = useCreatePostImages();
  const [sourceImages, setSourceImages] = useState<ImageURISource[]>();
  const navigation = useNavigation();

  React.useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <Link href="../">Cancel</Link>,
    });
  }, [navigation]);

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
          message: 'Posted',
          detailPostHref: `/${rootNameTab}/posts/${responseCreatePost.data.id}`,
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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={100}
      >
        <SafeAreaView className="flex-1 p-5">
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="flex-1">
              <View className="flex-row gap-2">
                <View className="w-[10%]">
                  <Avatar path={dataUser?.avatar} />
                </View>
                <View className="w-[90%] flex-1">
                  <Text className="font-semibold">{dataUser?.username}</Text>

                  {/* Content Input Area */}
                  <TextInput
                    autoFocus
                    editable={!isPending}
                    placeholder="What's new"
                    autoCapitalize="none"
                    ref={inputRef}
                    onChangeText={(val) => setContent(val)}
                    multiline
                    numberOfLines={10}
                    className="flex-1"
                  />

                  {/* Image Previews */}
                  {sourceImages && sourceImages.length > 0 && (
                    <View className="flex-row flex-wrap gap-4 mt-4">
                      {sourceImages.map((item, index) => (
                        <View key={index} className="relative">
                          <Image source={item} className="w-40 h-40 rounded-md" />
                          <Ionicons
                            onPress={() => removeImage(index)}
                            className="absolute right-2 top-2 bg-black/50 rounded-full p-1"
                            name="close"
                            size={20}
                            color="white"
                          />
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Action Icons */}
                  <View className="flex-row gap-7 mt-4">
                    <Pressable onPress={pickImage}>
                      <Ionicons name="images-outline" size={sizeIcon} color={colorIcon} />
                    </Pressable>
                    <Feather name="camera" size={sizeIcon} color={colorIcon} />
                    <SimpleLineIcons name="microphone" size={sizeIcon} color={colorIcon} />
                    <Ionicons name="location-outline" size={sizeIcon} color={colorIcon} />
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Submit Button */}
          <View className="bg-white pb-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-md text-zinc-400">Anyone can reply & quote</Text>
              <Button disabled={isPending} onPress={onSubmit} className="rounded-full">
                <Text>Post</Text>
              </Button>
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </AuthWrapper>
  );
}
