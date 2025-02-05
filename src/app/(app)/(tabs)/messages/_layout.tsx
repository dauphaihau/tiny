import React from 'react';
import { router, Stack } from 'expo-router';
import { ProfileToggle } from '@/components/common/ProfileToggle';
import { TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const sizeIcon = 21;

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
      <Stack.Screen
        name="[receiver_id]"
        getId={({ params }) => params?.receiver_id}
        options={{
          headerTitle: 'Chat',
          headerLeft: () => (
            <TouchableOpacity onPress={router.back}>
              <Ionicons name="arrow-back-outline" size={sizeIcon}/>
            </TouchableOpacity>
          ),
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}
