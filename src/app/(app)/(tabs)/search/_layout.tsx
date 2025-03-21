import React from 'react';
import { Stack } from 'expo-router';

export default function SearchLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="detail/[search]"
        getId={({ params }) => params?.search}
        options={{
          headerShown: false,
          animation: 'fade',
          animationDuration: 200,
        }}
      />
    </Stack>
  );
}
