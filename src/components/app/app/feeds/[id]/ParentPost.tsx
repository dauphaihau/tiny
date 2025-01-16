import {
  View, Text, Pressable, Image
} from 'react-native';
import { router } from 'expo-router';
import { Avatar } from '@/components/common/Avatar';
import { parseCreatedAt } from '@/lib/day';
import { ScrollView } from 'react-native-gesture-handler';
import { getImage } from '@/services/image.service';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { GetDetailPostResponse } from '@/services/post.service';

const sizeIcon = 18;
const colorIcon = 'gray';

interface ParentPostProps {
  data: GetDetailPostResponse
}

export function ParentPost({ data }: ParentPostProps) {
  function navigateToProfile() {
    router.replace(`/profiles/${data?.profile.id}`);
  }

  return (
    <View className="relative">
      <View className="py-5">
        <View className="gap-3 px-4">
          <View className="flex-row items-center gap-3">
            <Pressable onPress={navigateToProfile}>
              <Avatar path={data?.profile?.avatar}/>
            </Pressable>
            <Text onPress={navigateToProfile} className="font-semibold">{data?.profile?.username}</Text>
            <Text className="font-medium text-zinc-400">{parseCreatedAt(data?.created_at)}</Text>
          </View>
          <Text>{data?.content}</Text>
        </View>

        {
          data?.images && data.images.length > 0 && (
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
        <View className="pl-4 flex-row gap-5 mt-3">
          <Feather name="heart" size={sizeIcon} color={colorIcon}/>
          <Feather name="message-circle" size={sizeIcon} color={colorIcon}/>
        </View>
      </View>
    </View>
  );
}
