import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTabBarStore } from '@/stores/tab-bar.store';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { TAB_BAR_HEIGHT } from '@/constants/layout';
import { BlurView } from 'expo-blur';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue
} from 'react-native-reanimated';
import { useScrollPositionStore } from '@/stores/scroll-position.store';
import { useNavigation } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Separator } from '../common/Separator';

const SCROLL_PROGRESS_INCREMENT = 0.5; // increment of scroll progress
const SIZE_ICON = 24;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function CustomTabBar({
  state, descriptors, navigation: navigationTabBar,
}: BottomTabBarProps) {
  const { isDarkColorScheme, themeColors } = useColorScheme();
  const setIsShowTabBar = useTabBarStore((state) => state.setIsShow);
  const isShowTabBar = useTabBarStore((state) => state.isShow);
  const isStaticTabBar = useTabBarStore((state) => state.isStatic);

  // For backward compatibility and to trigger re-renders
  const { scrollY, isScrollingDown, currentRouteKey } = useScrollPositionStore();
  const getCurrentRouteState = useScrollPositionStore((state) => state.getCurrentRouteState);

  // Animation values
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const lastScrollY = useSharedValue(0);
  const progressValue = useSharedValue(0);

  const navigation = useNavigation();

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('state', () => {

      // Reset animation values when screen changes
      translateY.value = withSpring(0, { damping: 20, stiffness: 150, mass: 1 });
      opacity.value = withSpring(1, { damping: 15, stiffness: 150, mass: 1 });
      progressValue.value = 0;
      lastScrollY.value = 0;
    });

    return unsubscribe;
  }, [navigation, translateY, opacity, progressValue, lastScrollY, setIsShowTabBar]);

  React.useEffect(() => {
    // Get current scroll state based on the current route
    const scrollState = getCurrentRouteState();

    // Skip negative scroll values (pull-to-refresh)
    if (scrollState.scrollY < 0) return;

    // If tab bar is static, reset animations and exit
    if (isStaticTabBar || scrollState.scrollY < 5) {
      translateY.value = withSpring(0, { damping: 20, stiffness: 150, mass: 1 });
      opacity.value = withSpring(1, { damping: 15, stiffness: 150, mass: 1 });
      return;
    }

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

    // Apply animations with spring physics - independent of isVisibleTabBar
    translateY.value = withSpring(
      progressValue.value * TAB_BAR_HEIGHT,
      { damping: 30, stiffness: 150, mass: 1 }
    );

    opacity.value = withSpring(
      1 - progressValue.value,
      { damping: 15, stiffness: 150, mass: 1 }
    );
  }, [scrollY, isScrollingDown, isStaticTabBar, currentRouteKey, getCurrentRouteState]);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const animatedTabStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (!isShowTabBar) {
    return null;
  }

  return (
    <View style={styles.container}>
      <BlurView
        tint={isDarkColorScheme ? 'dark' : 'systemThickMaterialLight'}
        intensity={isDarkColorScheme ? 60 : 80}
        style={[
          styles.container,
          animatedContainerStyle,
        ]}
      >
        <Separator/>
        <View className="flex-row pt-2.5">
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            // const label = options.tabBarLabel || options.title || route.name;
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigationTabBar.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigationTabBar.navigate(route.name);
              }
            };

            const onLongPress = () => {
              navigationTabBar.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };

            return (
              <AnimatedPressable
                key={route.key}
                accessibilityRole="button"
                accessibilityState={{ selected: isFocused }}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                onPress={onPress}
                onLongPress={onLongPress}
                style={[
                  styles.tab,
                  animatedTabStyle,
                ]}
              >
                {options.tabBarIcon && options.tabBarIcon({
                  focused: isFocused,
                  color: themeColors.foreground,
                  size: SIZE_ICON,
                })}
                {/*<Text className='text-sm'>{label}</Text>*/}
              </AnimatedPressable>
            );
          })}
        </View>
      </BlurView>
      { isDarkColorScheme && <View style={styles.overlay}/>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: TAB_BAR_HEIGHT,
    zIndex: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.9)', // Darker overlay for better contrast
    zIndex: 10,
  },
  tab: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
