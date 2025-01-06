import { View } from 'react-native';
import { Link, Stack } from 'expo-router';
import React from 'react';

export default function SettingsScreen() {
  return (
    <View>
      <Stack.Screen
        options={{
          headerLeft: () => <Link href="../">Cancel</Link>,
        }}
      />
    </View>
  );
}
