import { Drawer } from 'expo-router/drawer';
import { Dimensions } from 'react-native';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthWrapper } from '@/components/common/AuthWrapper';
import { CustomDrawerContent } from '@/components/app/app/CustomDrawerContent';
import { useSegments } from 'expo-router';

const allowSwipeList = [
  '(app)/(tabs)/home',
  '(app)/(tabs)/messages/',
  '(app)/(tabs)/notifications',
  '(app)/(tabs)/search',
];

export default function AppLayout() {
  const segments = useSegments();
  const segmentsAsString = segments.join('/');

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
        >
          <Drawer.Screen
            name="(tabs)"
            options={{
              swipeEnabled: allowSwipeList.includes(segmentsAsString),
            }}
          />
        </Drawer>
      </AuthWrapper>
    </GestureHandlerRootView>
  );
}
