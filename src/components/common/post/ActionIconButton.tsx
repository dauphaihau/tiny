import React, { useEffect, useRef, useState } from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Button, ButtonProps } from '@/components/ui/Button';
import { Icon, IconName } from '@/components/common/Icon';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  Easing 
} from 'react-native-reanimated';
import { View } from 'react-native';
import { cn } from '@/utils';

const ICON_SIZE = 21;
const ANIMATION_DURATION = 200;

interface LayoutActionButtonProps extends ButtonProps {
  iconName: IconName;
  count?: number;
  countColor?: string;
  iconClassName?: string;
}

export const ActionIconButton: React.FC<LayoutActionButtonProps> = ({
  count, iconName, iconClassName, countColor, ...props
}) => {
  const { themeColors } = useColorScheme();
  const prevCountRef = useRef<number | undefined>(count);
  const [isInitialMount, setIsInitialMount] = useState(true);
  
  // Animation values
  const currentOpacity = useSharedValue(1);
  const currentTranslateY = useSharedValue(0);
  const newOpacity = useSharedValue(0);
  const newTranslateY = useSharedValue(0);
  
  const currentCountStyle = useAnimatedStyle(() => ({
    opacity: currentOpacity.value,
    transform: [{ translateY: currentTranslateY.value }],
    position: 'absolute',
  }));
  
  const newCountStyle = useAnimatedStyle(() => ({
    opacity: newOpacity.value,
    transform: [{ translateY: newTranslateY.value }],
  }));

  // Handle initial mount
  useEffect(() => {
    if (isInitialMount) {
      setIsInitialMount(false);
    }
    else if (count && count > 0) {
      // After initial mount, fade in the count if it's positive
      newOpacity.value = withTiming(1, { duration: ANIMATION_DURATION });
    }
  }, [isInitialMount]);
  
  useEffect(() => {
    // Early return for initial mount case
    if (isInitialMount) {
      return;
    }
    
    // Handle special case: 0 to 1 transition
    if (prevCountRef.current === 0 && count === 1) {
      newOpacity.value = withTiming(1, { duration: ANIMATION_DURATION });
      prevCountRef.current = count;
      return;
    }
    
    // Handle special case: 1 to 0 transition
    if (prevCountRef.current === 1 && count === 0) {
      newOpacity.value = withTiming(0, { duration: ANIMATION_DURATION });
      prevCountRef.current = count;
      return;
    }

    if (prevCountRef.current === undefined || prevCountRef.current === count) {
      prevCountRef.current = count;
      return;
    }
    
    // Skip animation if current or new count is 0 (handled by special cases above)
    if (count === 0 || prevCountRef.current === 0) {
      prevCountRef.current = count;
      return;
    }
    
    const isIncreasing = (count || 0) > (prevCountRef.current || 0);
    
    // Reset new count position before animation starts
    newTranslateY.value = isIncreasing ? 20 : -20; // Start from below or above
    
    // Animate out current count
    currentOpacity.value = withTiming(0, { duration: ANIMATION_DURATION });
    currentTranslateY.value = withTiming(
      isIncreasing ? -20 : 20, 
      { duration: ANIMATION_DURATION, easing: Easing.out(Easing.ease) }
    );
    
    // Animate in new count
    newOpacity.value = withTiming(1, { duration: ANIMATION_DURATION });
    newTranslateY.value = withTiming(
      0, 
      { duration: ANIMATION_DURATION, easing: Easing.out(Easing.ease) }
    );
    
    // Update reference after animation
    const timeoutId = setTimeout(() => {
      prevCountRef.current = count;
    }, ANIMATION_DURATION);
    
    return () => clearTimeout(timeoutId);
  }, [count, isInitialMount]);
  
  return (
    <Button
      variant="none"
      size="none"
      leadingIcon={
        <Icon
          name={iconName || ''}
          size={ICON_SIZE}
          className={cn('text-icon', iconClassName)}
        />
      }
      {...props}
    >
      {count ? (
        <View className="min-w-5 overflow-hidden">
          {prevCountRef.current !== undefined && 
           prevCountRef.current !== count && 
           prevCountRef.current > 0 && (
            <Animated.Text 
              style={[currentCountStyle, { color: countColor || themeColors.icon }]}
              className="font-normal"
            >
              {prevCountRef.current}
            </Animated.Text>
          )}
          {count > 0 && (
            <Animated.Text 
              style={[newCountStyle, { color: countColor || themeColors.icon }]}
              className="font-normal"
            >
              {count}
            </Animated.Text>
          )}
        </View>
      ) : null}
    </Button>
  );
};