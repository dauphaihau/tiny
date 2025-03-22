import React, { useEffect } from 'react';
import {
  Keyboard,
  Platform,
  StyleSheet,
  ViewStyle
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTabBarStore } from '@/stores/tab-bar.store';
import { TAB_BAR_CONFIG } from '@/components/layout/constants';

interface SmoothKeyboardAvoidingViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
  contentDuration?: number;
  offset?: number;
  customInput?: React.ReactNode;
}

export const SmoothKeyboardAvoidingView = ({
  children,
  style,
  contentDuration = 300,
  offset = 0,
  customInput,
}: SmoothKeyboardAvoidingViewProps) => {
  const insets = useSafeAreaInsets();
  const keyboardHeight = useSharedValue(0);
  const isShowTabBar = useTabBarStore((state) => state.isShow);
  const isKeyboardVisible = useSharedValue(false);
  const animationProgress = useSharedValue(0);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        // Get keyboard height
        keyboardHeight.value = e.endCoordinates.height;
        isKeyboardVisible.value = true;
        
        // Animate progress from 0 to 1
        animationProgress.value = withTiming(1, {
          duration: contentDuration,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        // Keep the keyboardHeight value but animate progress to 0
        isKeyboardVisible.value = false;
        
        // Animate progress from 1 to 0
        animationProgress.value = withTiming(0, {
          duration: contentDuration,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, [contentDuration]);

  const animatedContainerStyle = useAnimatedStyle(() => {
    // Use animationProgress for a smoother animation
    const paddingValue = interpolate(
      animationProgress.value,
      [0, 1],
      [0, keyboardHeight.value]
    );

    return {
      paddingBottom: paddingValue,
    };
  });

  const animatedInputStyle = useAnimatedStyle(() => {
    // Position input above keyboard, accounting for tab bar
    const basePosition = isShowTabBar ? TAB_BAR_CONFIG.TAB_BAR_HEIGHT : insets.bottom;
    
    // Calculate how much we need to move up
    const targetOffset = keyboardHeight.value - basePosition + offset;
    
    // Use animationProgress for smooth animation
    const translateY = interpolate(
      animationProgress.value,
      [0, 1],
      [0, -targetOffset]
    );

    return {
      bottom: basePosition,
      transform: [{ translateY }],
    };
  });

  return (
    <Animated.View style={[styles.container, animatedContainerStyle, style]}>
      {children}
      <Animated.View style={[styles.inputContainer, animatedInputStyle]}>
        {customInput}
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 9,
  },
});