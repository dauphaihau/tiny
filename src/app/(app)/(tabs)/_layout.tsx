import { Tabs } from 'expo-router';
import React from 'react';
import { Pressable } from 'react-native';
import Foundation from '@expo/vector-icons/Foundation';
import { Feather } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Avatar } from '@/components/common/Avatar';
import { useGetCurrentUser } from '@/services/user.service';

const sizeIcon = 22;

export const unstable_settings = {
  initialRouteName: 'feed',
};

export default function TabsLayout() {
  const { data: dataUser } = useGetCurrentUser();
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          height: 65,
        },
        headerLeft: () =>
          <Pressable onPress={() => navigation.toggleDrawer()}>
            <Avatar path={dataUser?.avatar} className='ml-4'/>
          </Pressable>,
        tabBarShowLabel: false,
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="feeds"
        options={{
          title: 'Feed',
          tabBarIcon: ({ color }) => <Foundation size={sizeIcon} name="home" color={color}/>,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <Feather name="search" size={sizeIcon} color={color}/>,
        }}
      />
      <Tabs.Screen
        name="new-post-blank"
        options={{
          title: 'New post',
          tabBarIcon: ({ color }) => <Feather name="plus" size={sizeIcon} color={color}/>,
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('modals/new-post');
          },
        })}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ color }) => <Ionicons name="notifications-outline" size={sizeIcon} color={color}/>,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color }) => <Feather name="mail" size={sizeIcon} color={color}/>,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{ href: null, headerShown: false }}
      />
    </Tabs>
  );
}
