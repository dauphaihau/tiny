import React from 'react';
import { Stack } from 'expo-router';

export default function ProfilesLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        getId={({ params }) => params?.id}
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
