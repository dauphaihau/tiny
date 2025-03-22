import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMemo } from 'react';
import { BASE_HEADER_HEIGHT, HEADER_PADDING_BOTTOM, TAB_HEIGHT } from '@/components/layout/constants';

/**
 * Hook to calculate the dynamic header height based on device insets and tabs
 * @param tabs Optional tabs array to determine if tabs are present
 * @returns Total header height in pixels
 */
export function useHeaderHeight(tabs?: { label: string; value: string }[]) {
  const insets = useSafeAreaInsets();
  
  return useMemo(() => {
    // Calculate base height with insets
    let height = insets.top + BASE_HEADER_HEIGHT;
    
    // Add tab height if tabs are present
    if (tabs && tabs.length > 0) {
      height += TAB_HEIGHT;
      height += HEADER_PADDING_BOTTOM;
    }
    
    return height;
  }, [insets.top, tabs]);
}