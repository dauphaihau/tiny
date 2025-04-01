import { Href, Link, router } from 'expo-router';
import { DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { supabase } from '@/lib/supabase';
import React from 'react';
import { useGetCurrentProfile } from '@/services/profile.service';
import { useQueryClient } from '@tanstack/react-query';
import { useRootNameTab } from '@/hooks/useRootNameTab';
import { Icon, IconName } from '@/components/common/Icon';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Separator } from '@/components/common/Separator';
import { featureNotAvailable } from '@/utils';
import { Avatar } from '@/components/common/Avatar';
import { Button } from '@/components/ui/Button';

interface ILink {
  name: string;
  href: Href;
  icon: IconName;
}

export const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const { isDarkColorScheme, toggleColorScheme } = useColorScheme();
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
    router.replace('/');
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View className="px-4 flex-1 flex-col">
        <View className="gap-1">
          <Avatar onPress={navigateToProfile} path={currentProfile?.avatar} className="size-12"/>
          <Pressable onPress={navigateToProfile} className="mt-2">
            <Text className="font-bold text-xl leading-none">{currentProfile?.first_name}</Text>
            <Text className="text-lg leading-none mt-0.5">{currentProfile?.username}</Text>
          </Pressable>
          <View className="flex-row gap-2.5">
            <View className="flex-row gap-0.5">
              <Text className="font-semibold">{currentProfile?.following_count ?? 0}</Text>
              <Text className="text-muted-foreground">Following</Text>
            </View>
            <View className="flex-row gap-0.5">
              <Text className="font-semibold">{currentProfile?.followers_count ?? 0}</Text>
              <Text className="text-muted-foreground">Followers</Text>
            </View>
          </View>
        </View>

        <View className="mt-7">
          <View style={{ gap: 17 }}>
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
                  <Icon name={item.icon} size={22} weight='bold'/>
                  <Text className="font-semibold text-2xl">{item.name}</Text>
                </Pressable>
              </Link>
            ))}
          </View>
        </View>

        <Separator className="my-7"/>

        <View className="gap-4 flex-1">
          <Text
            className="font-medium text-lg"
            onPress={featureNotAvailable}
          >Settings and privacy</Text>
          <Pressable onPress={logout}>
            <Text className="text-destructive font-medium text-lg">Log out</Text>
          </Pressable>
        </View>

        <View className="flex-row">
          <Button
            onPress={toggleColorScheme}
            icon={isDarkColorScheme ? 'moon' : 'sun'}
            variant="none"
            size="lg"
          />
        </View>
      </View>
    </DrawerContentScrollView>
  );
};
