import { ActivityIndicator, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { BlurView, BlurViewProps } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SharedValue, useDerivedValue, useAnimatedReaction } from 'react-native-reanimated';
import { Button } from '@/components/ui/Button';
import { featureNotAvailable } from '@/utils';
import { Text } from '@/components/ui/Text';
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { useGetCurrentProfile, useGetProfileById } from '@/services/profile.service';
import { SearchParams } from '@/components/shared-screens/detail-profile/types';
import { FollowButton } from '@/components/common/FollowButton';
import React, { useState, forwardRef } from 'react';
import { runOnJS } from 'react-native-reanimated';
import { DETAIL_PROFILE_CONFIG } from './constants';
import { Icon } from '@/components/common/Icon';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

const CONSTANTS = {
  BLUR_MAX_INTENSITY: 60,
  ICON_SIZE: 17,
  SCROLL_THRESHOLD: {
    START: 100,
    FADE_START: 133,
    FADE_END: 167,
  },
  PULL_TO_REFRESH: {
    // Multiplier to control how responsive the indicator is to pull gesture
    // Lower values make the movement more subtle
    TRANSLATION_MULTIPLIER: 0.2,
    // Maximum distance in pixels the indicator can move down
    // Prevents excessive movement when pulling far down
    MAX_TRANSLATION: 15,
  },
} as const;

interface FixedHeaderProps extends BlurViewProps {
  scrollY: SharedValue<number>;
  refreshing?: boolean;
}

function BackButton() {
  return (
    <Button onPress={router.back} className="rounded-full bg-black/60 size-10" size="none" radius="full">
      <Icon name="chevron.left" size={CONSTANTS.ICON_SIZE} className="text-white" weight="bold"/>
    </Button>
  );
}

function ActionButtons({ isOwnProfile }: { isOwnProfile: boolean }) {
  return (
    <View className="flex-row gap-2">
      <Button onPress={featureNotAvailable} className="rounded-full bg-black/60 size-10" size="none" radius="full" >
        <Icon name="search" size={CONSTANTS.ICON_SIZE} className="text-white" weight="bold"/>
      </Button>
      <Button onPress={featureNotAvailable} className="rounded-full bg-black/60 size-10" size="none" radius="full" >
        {isOwnProfile ?
          (<Icon name="share" size={CONSTANTS.ICON_SIZE} className="text-white" weight="bold"/>) :
          (<Icon name="dots.horizontal" size={CONSTANTS.ICON_SIZE} className="text-white" weight="bold"/>)
        }
      </Button>
    </View>
  );
}

// Move worklet functions outside component to prevent recreation on each render
function calculateBlurIntensity(scrollY: number): number {
  'worklet';
  const { SCROLL_THRESHOLD, BLUR_MAX_INTENSITY } = CONSTANTS;
  if (scrollY < SCROLL_THRESHOLD.START) return 0;
  if (scrollY > SCROLL_THRESHOLD.START + 10) return BLUR_MAX_INTENSITY;
  return BLUR_MAX_INTENSITY * ((scrollY - SCROLL_THRESHOLD.START) / 10);
}

export const Header = forwardRef<React.ElementRef<typeof BlurView>, FixedHeaderProps>(function FixedHeader({
  scrollY, refreshing = false, ...props
}: FixedHeaderProps, ref) {
  const insets = useSafeAreaInsets();
  const { id: profileId } = useLocalSearchParams<SearchParams>();
  const { data: profile, refetch: refetchProfile } = useGetProfileById(profileId);
  const { data: currentProfile } = useGetCurrentProfile();
  const isOwnProfile = currentProfile?.id === profile?.id;
  const [blurIntensityState, setBlurIntensityState] = useState(0);
  const [scrollYState, setScrollYState] = useState(0);
  const safeAreaInsets = useSafeAreaInsets();

  // Create derived values for animated properties to avoid direct access in render
  const blurIntensity = useDerivedValue(() => {
    'worklet';
    return calculateBlurIntensity(scrollY.value);
  }, [scrollY]);

  // Update React state from the animated value
  useAnimatedReaction(
    () => blurIntensity.value,
    (result) => {
      runOnJS(setBlurIntensityState)(result);
    }
  );

  // Update scrollY state from the animated value
  useAnimatedReaction(
    () => scrollY.value,
    (value) => {
      runOnJS(setScrollYState)(value);
    }
  );

  const fadeInfoProfileStyle = useAnimatedStyle(() => {
    const { FADE_START, FADE_END } = CONSTANTS.SCROLL_THRESHOLD;
    return {
      opacity: interpolate(scrollY.value, [FADE_START, FADE_END], [0, 1]),
      transform: [{
        translateY: interpolate(
          scrollY.value,
          [FADE_START, FADE_END],
          [50, 0],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        ),
      }],
    };
  });

  // Add animated style for the status refreshing indicator
  const statusRefreshingStyle = useAnimatedStyle(() => {
    // When scrollY is negative (pulling down), slide the indicator down proportionally
    const { TRANSLATION_MULTIPLIER, MAX_TRANSLATION } = CONSTANTS.PULL_TO_REFRESH;

    // Calculate translation based on how far the user has pulled down
    const translateY = scrollY.value < 0 ?
      Math.min(Math.abs(scrollY.value) * TRANSLATION_MULTIPLIER, MAX_TRANSLATION) :
      0;

    return {
      transform: [{ translateY }],
    };
  });

  const shouldShowFollowButton = profile &&
    !isOwnProfile &&
    !profile.is_following &&
    scrollYState > CONSTANTS.SCROLL_THRESHOLD.START;

  const renderRefreshIndicator = () => {
    if (refreshing || (scrollYState <= DETAIL_PROFILE_CONFIG.SCROLL_THRESHOLD.REFRESH)) {
      return <ActivityIndicator color="white"/>;
    }
    else if (scrollYState < 0) {
      return <Icon name="arrow.down" size={20} className="text-white" weight="bold"/>;
    }
    return null;
  };

  return (
    <>
      <BlurView
        ref={ref}
        tint="dark"
        intensity={blurIntensityState}
        className="absolute top-0 left-0 z-40 min-w-full"
        style={{
          paddingTop: safeAreaInsets.top,
        }}
        {...props}
      >
        <View className="flex-1 flex-row justify-between items-center px-5 pb-1.5 relative h-12">
          <View className="flex-row gap-3 items-center">
            <BackButton/>
            <Animated.View style={fadeInfoProfileStyle}>
              <Text className="text-white font-semibold text-lg leading-none">{profile?.username}</Text>
              <Text className="text-white text-sm leading-none mt-0.5">{profile?.posts_count} posts</Text>
            </Animated.View>
          </View>

          {shouldShowFollowButton ? (
            <FollowButton
              profileId={profile.id}
              isFollowing={profile.is_following}
              onSuccess={refetchProfile}
            />
          ) : (
            <ActionButtons isOwnProfile={isOwnProfile}/>
          )}

          <Animated.View
            className="absolute inset-x-0 -bottom-1 items-center"
            style={statusRefreshingStyle}
          >
            {renderRefreshIndicator()}
          </Animated.View>
        </View>
      </BlurView>

      <StatusBar style='light'/>
      <LinearGradient
        colors={['rgba(0,0,0,0.2)', 'transparent']}
        locations={[0.01, 0.8]}
        style={{
          height: insets.top,
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          zIndex: 10,
        }}
      />
    </>
  );
});
