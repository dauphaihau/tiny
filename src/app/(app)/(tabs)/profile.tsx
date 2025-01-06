import { View, Text } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  return (
    <SafeAreaView>
      <View className="items-center justify-center h-full">
        <Text>Profile Screen</Text>
      </View>
    </SafeAreaView>
  );
}
