import { Href, Link, router } from 'expo-router';
import { DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { supabase } from '@/lib/supabase';
import React from 'react';
import { Feather } from '@expo/vector-icons';
import { useGetCurrentProfile } from '@/services/profile.service';
import { Avatar } from '@/components/common/Avatar';
import { useQueryClient } from '@tanstack/react-query';
import { useRootNameTab } from '@/hooks/useRootNameTab';

interface ILink {
  name: string;
  href: Href;
  icon: keyof typeof Feather.glyphMap;
}

export const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const { data: currentProfile } = useGetCurrentProfile();
  const queryClient = useQueryClient();
  const rootNameTab = useRootNameTab();

  const links: ILink[] = [
    { name: 'Profile', icon: 'user', href: `/${rootNameTab}/profiles/${currentProfile?.id}` as Href },
    { name: 'Bookmarks', icon: 'bookmark', href: '/' },
    { name: 'Archive', icon: 'archive', href: '/' },
  ];

  const navigateToProfile = () => {
    router.push(`/${rootNameTab}/profiles/${currentProfile?.id}` as Href);
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log('error', error);
    }
    queryClient.removeQueries();
    queryClient.clear();
  };

  return (
    <DrawerContentScrollView {...props}>
      <View className="px-4">

        <View className="gap-1">
          <Pressable onPress={navigateToProfile}>
            <Avatar path={currentProfile?.avatar} className="size-12"/>
          </Pressable>
          <Pressable onPress={navigateToProfile} className="mt-2">
            <Text className="font-bold text-lg">{currentProfile?.first_name}</Text>
            <Text className="text-base">{currentProfile?.username}</Text>
          </Pressable>
          <View className="flex-row gap-2">
            <View className="flex-row gap-1">
              <Text className="font-semibold">{currentProfile?.following_count ?? 0}</Text>
              <Text className="text-zinc-500">Following</Text>
            </View>
            <View className="flex-row gap-1">
              <Text className="font-semibold">{currentProfile?.followers_count ?? 0}</Text>
              <Text className="text-zinc-500">Followers</Text>
            </View>
          </View>
        </View>

        <View className="mt-7">
          <View style={{ gap: 25 }}>
            {links.map((item) => (
              <Link
                disabled={item.href === '/'}
                key={item.name}
                href={item.href}
                push
                asChild
              >
                <Pressable
                  className={`flex-row items-center gap-5 ${item.href === '/' ? 'opacity-50' : ''}`}
                  pointerEvents={item.href === '/' ? 'none' : 'auto'} // Disable interaction if href is null
                >
                  <Feather name={item.icon} size={22} color="black"/>
                  <Text className="font-semibold text-2xl">{item.name}</Text>
                </Pressable>
              </Link>
            ))}
          </View>
        </View>

        <View className="border-[0.5px] border-zinc-200 my-7"/>

        <View className="gap-4">
          <Text
            className="font-medium"
            onPress={() => router.push('/modals/settings')}
          >Settings and privacy</Text>
          <Text
            className="text-red-600 font-medium"
            onPress={logout}
          >Log out</Text>
        </View>
      </View>
    </DrawerContentScrollView>
  );
};
