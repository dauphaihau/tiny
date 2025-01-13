import React from 'react';
import { router, Stack } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ProfileToggle } from '@/components/common/ProfileToggle';

export default function FeedsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Feeds',
          headerShown: true,
          headerLeft: () => <ProfileToggle/>,
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          headerTitle: 'Post',
          headerLeft: () => <Ionicons name="arrow-back-outline" size={24} onPress={() => router.back()}/>,
        }}
      />
    </Stack>
  );
}
