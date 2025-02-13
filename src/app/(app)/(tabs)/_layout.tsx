import { Tabs, useSegments } from 'expo-router';
import React from 'react';
import Foundation from '@expo/vector-icons/Foundation';
import { Feather } from '@expo/vector-icons';
import { ProfileToggle } from '@/components/common/ProfileToggle';

const sizeIcon = 22;
const hiddenScreens = ['/chat/[profile_id]'];

export const unstable_settings = {
  initialRouteName: 'home',
};

export default function TabsLayout() {
  const segments = useSegments();
  const segmentsAsString = segments.join('/');

  const isTabHidden = hiddenScreens.some((screen) => segmentsAsString.includes(screen));

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          height: 70,
          display: isTabHidden ? 'none' : 'flex',
        },
        tabBarShowLabel: false,
        headerLeft: () => <ProfileToggle className='ml-4'/>,
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <Foundation size={sizeIcon} name="home" color={color}/>,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          headerShown: false,
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
            navigation.navigate('modals/new-post', { rootNameTab: segments[2] });
          },
        })}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <Feather name="bell" size={sizeIcon} color={color}/>,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <Feather name="mail" size={sizeIcon} color={color}/>,
        }}
      />
    </Tabs>
  );
}
