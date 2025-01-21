import { Href, router } from 'expo-router';
import { DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';
import {
  FlatList, Pressable, View
} from 'react-native';
import { Text } from '@/components/ui/Text';
import { supabase } from '@/lib/supabase';
import React from 'react';
import { Feather } from '@expo/vector-icons';
import { usernameWithPrefix } from '@/lib/utils';
import { useGetCurrentProfile } from '@/services/profile.service';
import { Avatar } from '@/components/common/Avatar';

interface ILink {
  name: string;
  href: Href | null;
  icon: keyof typeof Feather.glyphMap;
}

export const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const { data: profile } = useGetCurrentProfile();

  const links: ILink[] = [
    { name: 'Profile', icon: 'user', href: `/profiles/${profile?.id}` },
    { name: 'Bookmarks', icon: 'bookmark', href: null },
    { name: 'Archive', icon: 'archive', href: null },
  ];

  return (
    <DrawerContentScrollView {...props}>
      <View className="px-4">
        <View className="gap-1">
          <Pressable onPress={() => router.push(`/profiles/${profile?.id}`)}>
            <Avatar path={profile?.avatar} className="size-12"/>
          </Pressable>
          <View className="mt-2">
            <Text className="font-bold">{profile?.first_name}</Text>
            <Text className="text-zinc-500">{usernameWithPrefix(profile?.username)}</Text>
          </View>
          <View className="flex-row gap-2">
            <View className="flex-row gap-1">
              <Text className="font-semibold">0</Text>
              <Text className="text-zinc-500">Following</Text>
            </View>
            <View className="flex-row gap-1">
              <Text className="font-semibold">0</Text>
              <Text className="text-zinc-500">Followers</Text>
            </View>
          </View>
        </View>

        <View className="mt-7">
          <FlatList
            scrollEnabled={false}
            data={links}
            contentContainerStyle={{ gap: 25 }}
            renderItem={({ item }) => (
              <Pressable
                disabled={!item.href}
                onPress={() => router.push(item.href ?? '/')}
              >
                <View
                  className="flex-row items-center gap-5"
                >
                  <Feather name={item.icon} size={22} color="black"/>
                  <Text className="font-semibold text-2xl">{item.name}</Text>
                </View>
              </Pressable>
            )}
            keyExtractor={(item) => item.name}
          />
        </View>

        <View className="border-[0.5px] border-zinc-200 my-7"/>

        <View className="gap-4">
          <Text
            className="font-medium"
            onPress={() => router.push('/modals/settings')}
          >Settings and privacy</Text>
          <Text
            className="text-red-600 font-medium"
            onPress={() => supabase.auth.signOut()}
          >Log out</Text>
        </View>
      </View>
    </DrawerContentScrollView>
  );
};
