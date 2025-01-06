import '../../global.css';
import {
  DarkTheme, DefaultTheme, Theme, ThemeProvider
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { NAV_THEME } from '@/constants/theme';
import { Platform } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

const useIsomorphicLayoutEffect =
  Platform.OS === 'web' && typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;

export default function RootLayout() {
  const hasMounted = React.useRef(false);
  const { isDarkColorScheme } = useColorScheme();
  const queryClient = new QueryClient();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  const [loaded] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) {
      return;
    }
    setIsColorSchemeLoaded(true);
    hasMounted.current = true;
  }, []);

  if (!loaded || !isColorSchemeLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
        <StatusBar style={isDarkColorScheme ? 'light' : 'dark'}/>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }}/>
          <Stack.Screen name="(app)" options={{ headerShown: false }}/>
          <Stack.Screen name="(auth)/login" options={{ headerShown: false }}/>
          <Stack.Screen name="(auth)/register" options={{ headerShown: false }}/>
          <Stack.Screen name="(auth)/forgot-password" options={{ headerShown: false }}/>
          <Stack.Screen name="(auth)/reset-password" options={{ headerShown: false }}/>
          <Stack.Screen name="modals/new-post" options={{ headerTitle: 'New post', presentation: 'modal' }}/>
          <Stack.Screen name="modals/settings" options={{ headerTitle: 'Settings', presentation: 'modal' }}/>
          <Stack.Screen name="+not-found"/>
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
