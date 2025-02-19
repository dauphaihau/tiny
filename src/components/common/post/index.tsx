import { Image, Pressable, View } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import { Text } from '@/components/ui/Text';
import { Avatar } from '@/components/common/Avatar';
import { getImage } from '@/services/image.service';
import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import { parsePostCreatedAt } from '@/lib/day';
import { SheetManager } from 'react-native-actions-sheet';
import { useGetCurrentProfile } from '@/services/profile.service';
import { LikePostButton } from '@/components/common/LikePostButton';
import { ReplyButton } from '@/components/common/post/ReplyButton';
import { useRootNameTab } from '@/hooks/useRootNameTab';
import { IPost } from '@/types/components/common/post';
import { usernameWithPrefix } from '@/lib/utils';

interface PostProps {
  data: IPost;
}

export const Post = ({ data }: PostProps) => {
  const { data: currentProfile } = useGetCurrentProfile();
  const rootNameTab = useRootNameTab();

  const navigateToProfile = () => {
    if (!data?.profile?.id || !rootNameTab) return;
    router.push(`/${rootNameTab}/profiles/${data.profile.id}`);
  };

  const navigateToDetailPost = () => {
    if (!data?.id || !rootNameTab) return;
    router.push(`/${rootNameTab}/posts/${data.id}`);
  };

  const showActions = async () => {
    if (currentProfile?.id === data.profile.id) {
      await SheetManager.show('current-profile-post-actions', {
        payload: {
          postId: data.id,
        },
      });
    }
    else {
      await SheetManager.show('post-actions', {
        payload: {
          postId: data.id,
        },
      });
    }
  };

  return (
    <View className="relative">
      <Pressable onPress={navigateToDetailPost}>
        <View>
          <View className="py-4">
            <View className="flex-row gap-4 px-4">
              <Pressable onPress={navigateToProfile} className='h-0'>
                <Avatar path={data?.profile?.avatar}/>
              </Pressable>

              <View className='w-[90%]'>
                <View className="flex-row gap-1.5">
                  <Text onPress={navigateToProfile} className="font-semibold">{data?.profile?.first_name}</Text>
                  <Text className="font-medium text-zinc-500">{usernameWithPrefix(data?.profile?.username)}</Text>
                  <Text className="font-medium text-zinc-500">·</Text>
                  <Text className="font-medium text-zinc-500">{parsePostCreatedAt(data?.created_at)}</Text>
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
              <LikePostButton post={data}/>
              <ReplyButton post={data}/>
            </View>
          </View>

          <View className="border-[0.4px] border-zinc-300 w-full"/>
        </View>
      </Pressable>

      <Pressable onPress={showActions} className="absolute top-2 right-2 p-2">
        <Entypo name="dots-three-horizontal" size={16} color="gray"/>
      </Pressable>
    </View>
  );
};