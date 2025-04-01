import { View, StyleSheet } from 'react-native';
import React, { useEffect, useCallback, useState } from 'react';
import { ProfileToggle } from '@/components/common/ProfileToggle';
import { Text } from '@/components/ui/Text';
import { Tabs } from '@/components/layout/Tabs';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BASE_HEADER_HEIGHT, HEADER_CONFIG, HEADER_PADDING_BOTTOM,
  headerClassNames,
  HEADER_SCROLL_HIDE_OFFSET,
  SCROLL_PROGRESS_INCREMENT, TAB_BAR_CONFIG
} from '@/components/layout/constants';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS
} from 'react-native-reanimated';
import { StatusBar, StatusBarStyle } from 'expo-status-bar';
import { useScrollPositionStore } from '@/stores/scroll-position.store';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Separator } from '@/components/common/Separator';
import { cn } from '@/utils';

interface HeaderProps {
  tabs?: { label: string; value: string }[];
  title?: string;
  headerMiddle?: React.ReactNode | ((size: number) => React.ReactNode);
  headerRight?: React.ReactNode | ((size: number) => React.ReactNode);
  headerLeft?: React.ReactNode | ((size: number) => React.ReactNode);
  headerLeftClassName?: string;
  headerMiddleClassName?: string;
  headerRightClassName?: string;
  borderVisible?: boolean;
  isStatic?: boolean;
}

interface HeaderSectionProps {
  children: React.ReactNode;
  className?: string;
  style?: object;
}

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

function HeaderSection({ children, className, style }: HeaderSectionProps) {
  return (
    <View className={className} style={style}>
      {children}
    </View>
  );
}

export function Header({
  tabs,
  title,
  borderVisible = true,
  headerMiddle,
  headerRight,
  headerLeft,
  headerLeftClassName,
  headerMiddleClassName,
  headerRightClassName,
  isStatic = true,
}: HeaderProps) {
  const insets = useSafeAreaInsets();
  const { isDarkColorScheme } = useColorScheme();
  const { scrollY, isScrollingDown, currentRouteKey } = useScrollPositionStore();

  const [statusBarStyle, setStatusBarStyle] = useState<StatusBarStyle>(
    isDarkColorScheme ? 'light' : 'auto'
  );

  // Animation values
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const lastScrollY = useSharedValue(0);
  const progressValue = useSharedValue(0);

  // Layout calculations
  const hasTabs = tabs && tabs.length > 1;

  // Get route-specific or global scroll state
  const getScrollState = useCallback(() => {
    const effectiveRouteKey = currentRouteKey;
    return effectiveRouteKey ?
      useScrollPositionStore.getState().getRouteState(effectiveRouteKey) :
      {
        scrollY: useScrollPositionStore.getState().scrollY,
        isScrollingDown: useScrollPositionStore.getState().isScrollingDown,
      };
  }, [currentRouteKey]);

  // Update status bar style when progress changes
  const updateStatusBarStyle = useCallback((progress: number) => {
    setStatusBarStyle(isDarkColorScheme || progress > 0.5 ? 'light' : 'auto');
  }, [isDarkColorScheme]);

  // Effect to update progress and status bar style
  useEffect(() => {
    // Get the current scroll state based on route
    const scrollState = getScrollState();

    // Skip animation if header is static
    if (isStatic) {
      translateY.value = 0;
      opacity.value = 1;
      return;
    }

    // Skip negative scroll values (pull-to-refresh)
    if (scrollState.scrollY < 0) return;

    // Update progress based on scroll direction
    if (scrollState.isScrollingDown) {
      // Increase progress when scrolling down
      progressValue.value = Math.min(
        progressValue.value + ((scrollState.scrollY - lastScrollY.value) * SCROLL_PROGRESS_INCREMENT),
        1
      );
    }
    else {
      // Decrease progress when scrolling up
      progressValue.value = Math.max(
        progressValue.value - ((lastScrollY.value - scrollState.scrollY) * SCROLL_PROGRESS_INCREMENT),
        0
      );
    }

    // Store current scroll position for next comparison
    lastScrollY.value = scrollState.scrollY;

    // Apply animations with spring physics
    translateY.value = withSpring(
      progressValue.value * HEADER_SCROLL_HIDE_OFFSET,
      { damping: 30, stiffness: 150, mass: 1 }
    );

    opacity.value = withSpring(
      1 - progressValue.value,
      { damping: 15, stiffness: 150, mass: 1 }
    );

    // Update status bar style
    runOnJS(updateStatusBarStyle)(progressValue.value);
  }, [scrollY, isScrollingDown, getScrollState, currentRouteKey, isStatic, isDarkColorScheme]);

  // Animated styles
  const animatedHeaderStyle = useAnimatedStyle(() => ({
    transform: isStatic ? [] : [{ translateY: translateY.value }],
    opacity: isStatic ? 1 : opacity.value,
  }));

  const animatedGradientStyle = useAnimatedStyle(() => ({
    opacity: isStatic ? 0 : (1 - opacity.value),
    height: insets.top,
  }));

  // Event handlers
  const handleTabPress = (value: string) => {
    router.setParams({ type: value });
  };

  // Render helper functions
  const renderLeft = () => {
    if (headerLeft === undefined) {
      return <ProfileToggle/>;
    }
    return typeof headerLeft === 'function' ? headerLeft(HEADER_CONFIG.ICON_SIZE) : headerLeft;
  };

  const renderMiddle = () => {
    if (headerMiddle === undefined) {
      return <Text className={headerClassNames.title}>{title}</Text>;
    }
    return typeof headerMiddle === 'function' ? headerMiddle(HEADER_CONFIG.ICON_SIZE) : headerMiddle;
  };

  const renderRight = () => {
    if (headerRight === undefined) {
      return <View className={headerClassNames.avatar}/>;
    }
    return typeof headerRight === 'function' ? headerRight(HEADER_CONFIG.ICON_SIZE) : headerRight;
  };

  return (
    <>
      <View className="absolute inset-x-0 top-0">
        <AnimatedBlurView
          tint={isDarkColorScheme ? 'dark' : 'light'}
          intensity={isDarkColorScheme ? 20 : 30}
          className="z-20"
          style={[
            styles.header,
            { paddingTop: insets.top },
            animatedHeaderStyle,
          ]}
        >
          <View>
            <Animated.View
              className={headerClassNames.container}
              style={{
                height: BASE_HEADER_HEIGHT,
                marginBottom: hasTabs ? 0 : HEADER_PADDING_BOTTOM,
              }}
            >
              <HeaderSection
                className={cn('h-full justify-center items-start z-20', headerLeftClassName)}
                style={{ flex: 1 }}
              >
                {renderLeft()}
              </HeaderSection>

              <HeaderSection
                className={cn('h-full justify-center items-center z-10', headerMiddleClassName)}
                style={{ position: 'absolute', left: 0, right: 0 }}
              >
                {renderMiddle()}
              </HeaderSection>

              <HeaderSection
                className={cn('h-full justify-center items-end z-20', headerRightClassName)}
                style={{ flex: 1 }}
              >
                {renderRight()}
              </HeaderSection>
            </Animated.View>

            {hasTabs && (
              <Tabs
                tabs={tabs}
                onPressTab={handleTabPress}
              />
            )}
            {borderVisible && <Separator/>}
          </View>
        </AnimatedBlurView>
        <View style={[
          styles.overlay,
          {
            backgroundColor: isDarkColorScheme ? TAB_BAR_CONFIG.DARK_OVERLAY_BACKGROUND_COLOR : TAB_BAR_CONFIG.LIGHT_OVERLAY_BACKGROUND_COLOR,
          },
        ]}/>
      </View>

      <StatusBar animated={true} style={statusBarStyle}/>
      <AnimatedLinearGradient
        colors={['rgba(0,0,0,0.3)', 'transparent']}
        locations={[0.01, 0.8]}
        style={[
          styles.gradient,
          animatedGradientStyle,
        ]}
      />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    zIndex: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 10,
  },
});
