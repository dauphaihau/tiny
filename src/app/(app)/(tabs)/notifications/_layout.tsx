import React from 'react';
import { Stack } from 'expo-router';
import { ProfileToggle } from '@/components/common/ProfileToggle';

export default function NotificationLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Notifications',
          headerLeft: () => <ProfileToggle/>,
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}
