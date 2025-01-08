import { Drawer } from 'expo-router/drawer';
import { Dimensions } from 'react-native';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthWrapper } from '@/components/common/AuthWrapper';
import { CustomDrawerContent } from '@/components/app/app/CustomDrawerContent';

export default function AppLayout() {
  return (
    <GestureHandlerRootView className="flex-1">
      <AuthWrapper>
        <Drawer
          drawerContent={(props) => CustomDrawerContent(props)}
          screenOptions={{
            headerShown: false,
            drawerStyle: {
              width: Dimensions.get('window').width * 0.78,
            },
          }}
        />
      </AuthWrapper>
    </GestureHandlerRootView>
  );
}
