import { View } from 'react-native';
import React, { useCallback } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { NoResults } from '@/components/common/NoResults';
import { Tabs } from '@/components/layout/Tabs';
import { ProfilePosts } from '@/components/shared-screens/detail-profile/ProfilePosts';
import { ProfileInfo } from '@/components/shared-screens/detail-profile/ProfileInfo';
import { ProfileActions } from '@/components/shared-screens/detail-profile/ProfileActions';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTabBarStore } from '@/stores/tab-bar.store';
import { useProfileAnimation, useProfileData } from '@/components/shared-screens/detail-profile/hooks';
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedScrollHandler,
  useSharedValue
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { Header } from './Header';
import { ProfileBackground } from '@/components/shared-screens/detail-profile/ProfileBackground';
import { SearchParams } from '@/components/shared-screens/detail-profile/types';
import { DETAIL_PROFILE_CONFIG } from '@/components/shared-screens/detail-profile/constants';
import { PostsByProfileType } from '@/types/request/post/get-posts-by-profile';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Separator } from '@/components/common/Separator';

const CONSTANTS = {
  HEADER_FIXED_THRESHOLD: 39,
  LOAD_MORE_THRESHOLD: 0.3,
};

const tabs = [
  { label: 'Posts', value: PostsByProfileType.ROOT },
  { label: 'Replies', value: PostsByProfileType.REPLY },
  { label: 'Media', value: PostsByProfileType.MEDIA },
];

export function DetailProfileScreen() {
  const { id: profileId, type = PostsByProfileType.ROOT } = useLocalSearchParams<SearchParams>();
  const navigation = useNavigation();
  const safeAreaInsets = useSafeAreaInsets();
  const setIsVisibleTabBar = useTabBarStore(state => state.setIsVisible);
  const isNearBottom = useSharedValue(false);
  const scrollViewRef = React.useRef<Animated.ScrollView>(null);
  const { themeColors } = useColorScheme();

  const {
    scrollY,
    scale,
    blurIntensity,
    isPullingToRefresh,
    lastScrollY,
    isHeaderFixed,
    blurIntensityState,
    headerHeight,
    setLastScrollY,
    setIsHeaderFixed,
    pullDownScaleStyle,
    fixedBackgroundStyle,
    backgroundRef,
  } = useProfileAnimation();

  const {
    profile,
    isPending,
    refreshing,
    handleRefresh,
    handleLoadMorePosts,
  } = useProfileData(profileId, type as PostsByProfileType);

  const handleScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      const contentHeight = event.contentSize.height;
      const layoutHeight = event.layoutMeasurement.height;
      const currentScrollY = event.contentOffset.y;
      scrollY.value = currentScrollY;

      // Check if user has scrolled to bottom (with threshold)
      const thresholdPoint = contentHeight * (1 - CONSTANTS.LOAD_MORE_THRESHOLD);
      const isAtBottom = (scrollY.value + layoutHeight) >= thresholdPoint;
      if (isAtBottom !== isNearBottom.value) {
        isNearBottom.value = isAtBottom;
      }

      if (currentScrollY <= DETAIL_PROFILE_CONFIG.SCROLL_THRESHOLD.REFRESH && !refreshing) {
        isPullingToRefresh.value = true;
      }
      else {
        isPullingToRefresh.value = false;
      }

      // Update blur intensity based on pull-down scroll
      if (currentScrollY < 0) {
        blurIntensity.value = Math.min(50, Math.abs(currentScrollY));
      }
      else {
        blurIntensity.value = 0;
      }

      // Direct animation calculation without runOnJS
      if (currentScrollY <= 0) {
        scale.value = 1;
      }
      else {
        scale.value = Math.max(0.6, 1 - (currentScrollY / 100));
      }

      // Use worklet to update JS state only when necessary
      if (Math.abs(currentScrollY - lastScrollY) > 5) {
        runOnJS(setLastScrollY)(currentScrollY);

        // Always show tab bar when scrolled to top or pulling down
        if (currentScrollY <= 0) {
          runOnJS(setIsVisibleTabBar)(true);
        }
        // Otherwise toggle tab bar visibility based on scroll direction
        else if (currentScrollY > lastScrollY) {
          // Scrolling down - hide tab bar
          runOnJS(setIsVisibleTabBar)(false);
        }
        else {
          // Scrolling up - show tab bar
          runOnJS(setIsVisibleTabBar)(true);
        }
      }

      if (currentScrollY >= CONSTANTS.HEADER_FIXED_THRESHOLD && !isHeaderFixed) {
        runOnJS(setIsHeaderFixed)(true);
      }
      else if (currentScrollY < CONSTANTS.HEADER_FIXED_THRESHOLD && isHeaderFixed) {
        runOnJS(setIsHeaderFixed)(false);
      }
    },
    onEndDrag: () => {
      if (isPullingToRefresh.value && !refreshing) {
        runOnJS(handleRefresh)();
      }
    },
  }, [lastScrollY, isHeaderFixed, refreshing]);

  const handleTabPress = useCallback((value: string) => {
    router.setParams({ type: value });
  }, []);

  const handleHeaderHeightChange = useCallback((height: number) => {
    headerHeight.value = height;
  }, [headerHeight]);

  // Use animated reaction to respond to scroll position changes
  useAnimatedReaction(
    () => {
      return isNearBottom.value;
    },
    (isAtBottom, previousIsAtBottom) => {
      if (isAtBottom && !previousIsAtBottom) {
        runOnJS(handleLoadMorePosts)();
      }
    },
    [handleLoadMorePosts]
  );

  React.useEffect(() => {
    navigation.setOptions({
      name: 'profiles/[id]',
      headerShown: false,
      getId: ({ params }: { params: { id: string } }) => params?.id,
    });
  }, [navigation]);

  if (isPending) return <LoadingScreen/>;
  if (!profile) return <NoResults/>;

  return (
    <View className="flex-1">
      <Header
        scrollY={scrollY}
        refreshing={refreshing}
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          handleHeaderHeightChange(height - safeAreaInsets.top);
        }}
      />

      {/* Fixed background when scrollY reaches threshold */}
      <Animated.View style={fixedBackgroundStyle} ref={backgroundRef}>
        <ProfileBackground/>
      </Animated.View>

      <Animated.ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        stickyHeaderIndices={[2]}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        contentContainerStyle={{
          flexGrow: 1,
        }}
      >
        {/*Background Profile */}
        <Animated.View style={pullDownScaleStyle}>
          <ProfileBackground/>
          <BlurView
            intensity={blurIntensityState}
            tint="dark"
            className="absolute top-0 left-0 z-40 min-w-full"
            style={{
              height: DETAIL_PROFILE_CONFIG.HEADER_HEIGHT,
            }}
          />
        </Animated.View>

        <View className="-mt-7 -mb-20 z-20">
          <View className="flex-row justify-between">
            <ProfileInfo className="px-3" profile={profile} animatedScale={scale}/>
            <ProfileActions profile={profile} className="absolute top-10 right-0 px-2"/>
          </View>
        </View>

        <SafeAreaView
          edges={['top']}
          className="z-10 pt-[40px]"
          style={{
            backgroundColor: themeColors.background,
          }}
        >
          <Tabs
            tabs={tabs}
            onPressTab={handleTabPress}
            defaultTab={type}
          />
          <Separator/>
        </SafeAreaView>

        <ProfilePosts/>
      </Animated.ScrollView>
    </View>
  );
}