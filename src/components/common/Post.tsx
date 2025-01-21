import { Image, Pressable, View } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import { Text } from '@/components/ui/Text';
import { Avatar } from '@/components/common/Avatar';
import { getImage } from '@/services/image.service';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { GetPostsResponse } from '@/services/post.service';
import { router } from 'expo-router';
import { parseCreatedAt } from '@/lib/day';
import { SheetManager } from 'react-native-actions-sheet';
import { useGetCurrentProfile } from '@/services/profile.service';

const sizeIcon = 18;
const colorIcon = 'gray';

interface PostProps {
  data: GetPostsResponse['data'][0];
}

export const Post = ({ data }: PostProps) => {
  const { data: currentProfile } = useGetCurrentProfile();

  function navigateToProfile() {
    router.push(`/profiles/${data.profile.id}`);
  }

  const showActions = async () => {
    if (currentProfile?.id === data.profile.id) {
      await SheetManager.show('current-profile-post-actions', {
        payload: {
          postId: data.id,
        },
      });
    }
    else {
      const result = await SheetManager.show('post-actions', {
        payload: {
          postId: data.id,
        },
      });
      console.log('result', result);
    }
  };

  return (
    <View className="relative">
      <Pressable onPress={() => router.push(`/feeds/${data.id}`)}>
        <View>
          <View className="py-5">

            <View className="flex-row gap-4 px-4">
              <Pressable onPress={navigateToProfile}>
                <Avatar path={data?.profile?.avatar}/>
              </Pressable>

              <View>
                <View className="flex-row gap-3">
                  <Text onPress={navigateToProfile} className="font-semibold">{data?.profile?.username}</Text>
                  <Text className="font-medium text-zinc-400">{parseCreatedAt(data?.created_at)}</Text>
                </View>
                <Text>{data?.content}</Text>
              </View>
            </View>

            {
              data.images?.length > 0 && (
                <View className="pl-16 mt-2">
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 16 }}
                  >
                    {
                      data.images.map(item => (
                        <Image
                          key={item.image_path}
                          source={getImage(item.image_path)}
                          className="size-52 rounded-md"
                        />
                      ))
                    }
                  </ScrollView>
                </View>
              )
            }
            <View className="pl-16 flex-row gap-5 mt-3">
              <Feather name="heart" size={sizeIcon} color={colorIcon}/>
              <Feather name="message-circle" size={sizeIcon} color={colorIcon}/>
            </View>
          </View>

          <View className="border-[0.4px] border-zinc-300 w-full"/>
        </View>
      </Pressable>

      <View className="absolute top-4 right-4">
        <Entypo onPress={showActions} name="dots-three-horizontal" size={16} color="gray"/>
      </View>
    </View>
  );
};