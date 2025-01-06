import { Href, router } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { useGetCurrentUser } from '@/services/auth';
import { DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';
import {
  Dimensions, FlatList, Image, Pressable, View,
} from 'react-native';
import { Text } from '@/components/ui/Text';
import { supabase } from '@/lib/superbase';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import { getUsernameFromEmail } from '@/lib/utils';

interface ILink {
  name: string;
  href: Href | null;
  icon: keyof typeof Feather.glyphMap;
}

const links: ILink[] = [
  { name: 'Profile', icon: 'user', href: '/profile' },
  { name: 'Bookmarks', icon: 'bookmark', href: null },
  { name: 'Archive', icon: 'archive', href: null },
];

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const { data } = useGetCurrentUser();

  return (
    <DrawerContentScrollView {...props}>
      <View className="px-4">
        <View className="gap-1">
          <Pressable onPress={() => router.push('/profile')}>
            <Image
              source={require('assets/images/avatar-default.jpg')}
              className="w-10 h-10 rounded-full"
            />
          </Pressable>
          <Text className="font-bold mt-2">{data?.first_name}</Text>
          <Text className="text-zinc-500">{getUsernameFromEmail(data?.email)}</Text>
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

export default function AppLayout() {
  return (
    <GestureHandlerRootView className="flex-1">
      <Drawer
        drawerContent={(props) => CustomDrawerContent(props)}
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            width: Dimensions.get('window').width * 0.78,
          },
        }}
      />
    </GestureHandlerRootView>
  );
}
