import '../../global.css';
import {
  DarkTheme,
  DefaultTheme, Theme, ThemeProvider
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, {
  useEffect, useLayoutEffect, useRef, useState 
} from 'react';
import 'react-native-reanimated';
import { NAVIGATION_THEME } from '@/constants/theme';
import { AppState, AppStateStatus, Platform } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { toastConfig } from '@/constants/toast';
import { SheetProvider } from 'react-native-actions-sheet';
import '@/components/sheet/sheets.ts';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/useColorScheme';
import * as Updates from 'expo-updates';
import { useCameraPermissions } from 'expo-camera';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAVIGATION_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAVIGATION_THEME.dark,
};

export default function RootLayout() {
  const hasMounted = useRef(false);
  const queryClient = new QueryClient();
  const { isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const [loaded] = useFonts({
    SpaceMono: require('assets/fonts/SpaceMono-Regular.ttf'),
  });

  useLayoutEffect(() => {
    if (hasMounted.current) {
      return;
    }
    if (Platform.OS === 'web') {
      // Adds the background color to the html element to prevent white background on overscroll.
      document.documentElement.classList.add('bg-background');
    }
    setIsColorSchemeLoaded(true);
    hasMounted.current = true;
  }, []);

  useEffect(() => {
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        // Check if coming back from settings and permission was previously denied
        if (permission && !permission.granted && !permission.canAskAgain) {
          // Re-check permission status
          const newPermission = await requestPermission();
          if (newPermission.granted) {
            console.log('Permission granted after returning from settings, reloading app...');
            await Updates.reloadAsync(); // Only reload when permission was granted after returning from settings
          }
        }
      }
    };
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [permission, requestPermission]);

  if (!loaded || !isColorSchemeLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
          <StatusBar style={isDarkColorScheme ? 'light' : 'dark'}/>
          <SheetProvider context="global">
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false, animation: 'none' }}/>
              <Stack.Screen name="(auth)/login" options={{ headerShown: false }}/>
              <Stack.Screen name="(auth)/register" options={{ headerShown: false }}/>
              <Stack.Screen name="(auth)/forgot-password" options={{ headerShown: false }}/>
              <Stack.Screen name="(auth)/reset-password" options={{ headerShown: false }}/>
              <Stack.Screen name="(app)" options={{ headerShown: false }}/>
              <Stack.Screen name="modals/new-post" options={{ headerTitle: 'New post', presentation: 'modal' }}/>
              <Stack.Screen name="modals/settings" options={{ headerTitle: 'Settings', presentation: 'modal' }}/>
              <Stack.Screen name="modals/camera" options={{ headerShown: false, presentation: 'fullScreenModal' }}/>
              <Stack.Screen
                name="modals/edit-profile"
                options={{ headerTitle: 'Edit profile', presentation: 'modal' }}
              />
              <Stack.Screen name="+not-found"/>
            </Stack>
          </SheetProvider>
          <Toast config={toastConfig} topOffset={60}/>
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
