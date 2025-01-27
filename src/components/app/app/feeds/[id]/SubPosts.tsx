import {
  FlatList, Image, Pressable, Text, View
} from 'react-native';
import React from 'react';
import { Avatar } from '@/components/common/Avatar';
import { parseCreatedAt } from '@/lib/day';
import { ScrollView } from 'react-native-gesture-handler';
import { getImage } from '@/services/image.service';
import { Feather } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import { router, useLocalSearchParams } from 'expo-router';
import { useGetDetailPost } from '@/services/post.service';
import { Post } from '@/types/models/post';
import { Profile } from '@/types/models/profile';

const sizeIcon = 18;
const colorIcon = 'gray';

export function SubPosts() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: detailPost } = useGetDetailPost(Number(id));

  function navigateToProfile(profileId: Profile['id']) {
    router.push(`/profiles/${profileId}`);
  }
  
  const navigateDetailSubPost = (subPostId: Post['id']) => {
    router.push(`/feeds/${subPostId}`);
  };

  return (
    <View>
      {
        detailPost && detailPost.sub_posts.length > 0 && (
          <FlatList
            scrollEnabled={false}
            data={detailPost.sub_posts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item: post }) => (
              <View className="relative">
                <Pressable onPress={() => navigateDetailSubPost(post.id)}>
                  <View className="border-[0.4px] border-zinc-300 w-full mx-auto"/>
                  <View className="py-5">

                    <View className="flex-row gap-4 px-4">
                      <Pressable onPress={() => navigateToProfile(post.profile.id)}>
                        <Avatar path={post?.profile?.avatar}/>
                      </Pressable>

                      <View>
                        <View className="flex-row gap-3">
                          <Text
                            onPress={() => navigateToProfile(post.profile.id)}
                            className="font-semibold"
                          >{post?.profile?.username}</Text>
                          <Text className="font-medium text-zinc-400">{parseCreatedAt(post?.created_at)}</Text>
                        </View>
                        <Text>{post?.content}</Text>
                      </View>
                    </View>

                    {
                      post?.images && post.images.length > 0 && (
                        <View className="pl-16 mt-2">
                          <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ gap: 16 }}
                          >
                            {
                              post.images.map(item => (
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
                    <View className="pl-16 flex-row gap-7 mt-3">
                      <Feather name="heart" size={sizeIcon} color={colorIcon}/>
                      <Feather name="message-circle" size={sizeIcon} color={colorIcon}/>
                    </View>
                  </View>
                </Pressable>

                <View className="absolute top-4 right-4">
                  <Entypo name="dots-three-horizontal" size={16} color="gray"/>
                </View>
              </View>
            )}
          />
        )
      }
    </View>
  );
}
