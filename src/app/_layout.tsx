import '../../global.css';
import {
  DarkTheme,
  DefaultTheme, Theme, ThemeProvider
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import 'react-native-reanimated';
import { NAVIGATION_THEME } from '@/constants/theme';
import { Platform } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { toastConfig } from '@/constants/toast';
import { SheetProvider } from 'react-native-actions-sheet';
import '@/components/sheet/sheets.ts';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/useColorScheme';

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

const useIsomorphicLayoutEffect =
  Platform.OS === 'web' && typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;

export default function RootLayout() {
  const hasMounted = React.useRef(false);
  const queryClient = new QueryClient();
  const { isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  const [loaded] = useFonts({
    SpaceMono: require('assets/fonts/SpaceMono-Regular.ttf'),
  });

  useIsomorphicLayoutEffect(() => {
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
