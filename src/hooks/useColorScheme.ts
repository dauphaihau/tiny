import { NAVIGATION_THEME } from '@/constants/theme';
import { useColorScheme as useNativewindColorScheme } from 'nativewind';

export function useColorScheme() {
  const { colorScheme, setColorScheme, toggleColorScheme } = useNativewindColorScheme();
  
  return {
    colorScheme: colorScheme ?? 'light',
    isDarkColorScheme: colorScheme === 'dark',
    themeColors: NAVIGATION_THEME[colorScheme || 'light'],
    setColorScheme,
    toggleColorScheme,
  };
}
