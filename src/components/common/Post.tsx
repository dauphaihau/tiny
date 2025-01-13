import { Image, Pressable, View } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import { Text } from '@/components/ui/Text';
import { Avatar } from '@/components/common/Avatar';
import { getImage } from '@/services/image.service';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { GetPostResponse } from '@/services/post.service';
import { router } from 'expo-router';
import { parseCreatedAt } from '@/lib/day';

const sizeIcon = 18;
const colorIcon = 'gray';

interface PostProps {
  data: GetPostResponse[0];
}

export const Post = ({ data }: PostProps) => {
  function navigateToProfile() {
    router.replace(`/profiles/${data.profile.id}`);
  }

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
                  <Text className="font-medium text-zinc-400">{parseCreatedAt(data.created_at)}</Text>
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
        <Entypo name="dots-three-horizontal" size={16} color="gray"/>
      </View>
    </View>
  );
};