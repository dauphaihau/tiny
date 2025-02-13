import { useSegments } from 'expo-router';

export function useRootNameTab() {
  const segments = useSegments();
  const rootNameTab = segments[2];

  return rootNameTab as 'home' | 'search' | 'messages' | 'notifications' | undefined;
}
