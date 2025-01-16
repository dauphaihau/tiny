import { Tabs } from 'expo-router';
import React from 'react';
import Foundation from '@expo/vector-icons/Foundation';
import { Feather } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ProfileToggle } from '@/components/common/ProfileToggle';

const sizeIcon = 22;

export const unstable_settings = {
  initialRouteName: 'feeds',
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          height: 65,
        },
        tabBarShowLabel: false,
        headerLeft: () => <ProfileToggle className='ml-4'/>,
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="feeds"
        options={{
          title: 'Feeds',
          headerShown: false,
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
        name="profiles"
        options={{ href: null, headerShown: false }}
      />
    </Tabs>
  );
}
