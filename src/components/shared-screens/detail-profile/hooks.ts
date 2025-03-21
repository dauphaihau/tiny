import { useState, useCallback } from 'react';
import Animated, {
  useSharedValue, useAnimatedStyle, useAnimatedReaction, runOnJS, useAnimatedRef
} from 'react-native-reanimated';
import { useGetProfileById } from '@/services/profile.service';
import { PostsByProfileType } from '@/types/request/post/get-posts-by-profile';
import { useWindowDimensions } from 'react-native';
import { useGetPostsByProfile } from '@/services/post/get-posts-by-profile';

export function useProfileAnimation() {
  const scrollY = useSharedValue(0);
  const scale = useSharedValue(1);
  const blurIntensity = useSharedValue(0);
  const isPullingToRefresh = useSharedValue(false);
  const headerHeight = useSharedValue(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isHeaderFixed, setIsHeaderFixed] = useState(false);
  const [blurIntensityState, setBlurIntensityState] = useState(0);
  const backgroundRef = useAnimatedRef<Animated.View>();
  const { height: windowHeight } = useWindowDimensions();

  useAnimatedReaction(
    () => blurIntensity.value,
    (result) => {
      runOnJS(setBlurIntensityState)(result);
    }
  );

  const pullDownScaleStyle = useAnimatedStyle(() => {
    const currentScrollY = scrollY.value;
    const scale = currentScrollY < 0 ? 1 - (currentScrollY / 200) : 1;
    return {
      marginTop: currentScrollY < 0 ? currentScrollY / 2 : 0,
      transform: [
        { translateY: currentScrollY < 0 ? currentScrollY / 2 : 0 },
        { scale },
      ],
    };
  });

  const fixedBackgroundStyle = useAnimatedStyle(() => {
    // Pre-calculate values for better performance
    const shouldFix = scrollY.value >= headerHeight.value;

    // Calculate base top position
    let topPosition = -Math.min(scrollY.value, headerHeight.value);

    // Apply additional offset to ensure bottom edges align perfectly
    // This accounts for device-specific differences
    // Device-specific adjustments based on screen height
    let extraOffset = 0;
    if (windowHeight >= 920) { // iPhone 12 Pro Max and similar
      extraOffset = -19;
    }
    else if (windowHeight >= 840 && windowHeight < 900) { // iPhone 16 and similar
      extraOffset = -7;
    }
    else if (windowHeight <= 667) { // iPhone SE (both generations)
      extraOffset = -46;
    }
    else {
      // For other devices, apply a proportional offset
      extraOffset = Math.round(-10 * (windowHeight / 850));
    }

    topPosition += extraOffset;

    return {
      position: 'absolute',
      top: topPosition,
      left: 0,
      right: 0,
      zIndex: 30,
      opacity: shouldFix ? 1 : 0,
    };
  });

  return {
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
  };
}

export function useProfileData(profileId: string, type: PostsByProfileType) {
  const {
    data: profile,
    isPending,
    refetch: refetchProfile,
  } = useGetProfileById(profileId);

  const {
    refetch: refetchPosts,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetPostsByProfile({
    targetProfileId: profileId,
    type,
  });

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refetchProfile(),
        refetchPosts(),
      ]);
    }
    finally {
      setRefreshing(false);
    }
  }, [refetchProfile, refetchPosts]);

  const handleLoadMorePosts = useCallback(() => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, isFetchingNextPage, hasNextPage]);

  return {
    profile,
    isPending,
    refreshing,
    handleRefresh,
    handleLoadMorePosts,
  };
}
