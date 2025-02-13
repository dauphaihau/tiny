import React from 'react';
import { Stack } from 'expo-router';
import { ProfileToggle } from '@/components/common/ProfileToggle';

export default function SearchLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Search',
          headerLeft: () => <ProfileToggle/>,
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}
