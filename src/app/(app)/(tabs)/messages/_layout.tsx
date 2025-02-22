import React from 'react';
import { Stack } from 'expo-router';
import { ProfileToggle } from '@/components/common/ProfileToggle';

export default function MessagesLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Messages',
          headerShown: true,
          headerLeft: () => <ProfileToggle/>,
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}
