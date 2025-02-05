import React from 'react';
import { router, Stack } from 'expo-router';
import { ProfileToggle } from '@/components/common/ProfileToggle';
import { TouchableOpacity, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';

const sizeIcon = 21;

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
        getId={({ params }) => params?.id}
        options={{
          headerTitle: 'Post',
          headerRight: () => (
            <View className="flex-row gap-3">
              <Feather name="bell" size={sizeIcon}/>
              <MaterialCommunityIcons name="dots-horizontal-circle-outline" size={sizeIcon} color="black"/>
            </View>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back-outline" size={sizeIcon}/>
            </TouchableOpacity>
          ),
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}
