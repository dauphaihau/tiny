import { Tabs, useSegments } from 'expo-router';
import React from 'react';
import { CustomTabBar } from '@/components/layout/CustomTabBar';
import { Icon } from '@/components/common/Icon';

export const unstable_settings = {
  initialRouteName: 'home',
};

export default function TabsLayout() {
  const segments = useSegments();

  return (
    <Tabs
      tabBar={props => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Icon size={size} name={focused ? 'home.fill' : 'home'} color={color}/>
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Icon name={focused ? 'search.fill' : 'search'} size={size} color={color}/>
          ),
        }}
      />
      <Tabs.Screen
        name="new-post-blank"
        options={{
          title: 'New post',
          tabBarIcon: ({ color, size }) => (<Icon name="plus" size={size + 2} color={color}/>
          ),
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
          tabBarIcon: ({ color, size, focused }) => (
            <Icon name={focused ? 'bell.fill' : 'bell'} size={size} color={color}/>
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Icon name={`message.circle.dots${focused ? '.fill' : ''}`} size={size} color={color}/>
          ),
        }}
      />
    </Tabs>
  );
}
