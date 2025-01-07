import { View } from 'react-native';
import { Link, Stack } from 'expo-router';
import React from 'react';
import { AuthWrapper } from '@/components/common/AuthWrapper';

export default function SettingsScreen() {
  return (
    <AuthWrapper>
      <View>
        <Stack.Screen
          options={{
            headerLeft: () => <Link href="../">Cancel</Link>,
          }}
        />
      </View>
    </AuthWrapper>
  );
}
