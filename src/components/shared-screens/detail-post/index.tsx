import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useGetDetailPost } from '@/services/post.service';
import React, { useState, useEffect, useCallback } from 'react';
import { RefreshControl, View } from 'react-native';
import { NoResults } from '@/components/common/NoResults';
import { ReplyForm } from '@/components/shared-screens/detail-post/ReplyForm';
import { ParentPost } from '@/components/shared-screens/detail-post/ParentPost';
import { Replies } from '@/components/shared-screens/detail-post/Replies';
import { useNavigation } from '@react-navigation/native';
import { BackScreenButton } from '@/components/layout/header/BackScreenButton';
import { featureNotAvailable } from '@/utils';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { SmoothKeyboardAvoidingView } from '@/components/common/SmoothKeyboardAvoidingView';
import { SheetManager } from 'react-native-actions-sheet';
import { useGetCurrentProfile } from '@/services/profile.service';
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedScrollHandler,
  useSharedValue
} from 'react-native-reanimated';
import { useGetRepliesPost } from '@/services/post/get-replies-post';
import { Header } from '@/components/layout/header';
import { useHeaderHeight } from '@/hooks/useHeaderHeight';
import { Icon } from '@/components/common/Icon';
import { useTabBarStore } from '@/stores/tab-bar.store';
import { useScrollPositionStore } from '@/stores/scroll-position.store';
import { TAB_BAR_CONFIG } from '@/components/layout/constants';

const CONSTANTS = {
  LOAD_MORE_THRESHOLD: 0.3,
};

export function DetailPostScreen() {
  const navigation = useNavigation();
  const { id: postId } = useLocalSearchParams<{ id: string }>();
  const { post, isPending, refetch: refetchPost } = useGetDetailPost(Number(postId));
  const {
    refetch: refetchReplies,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useGetRepliesPost(Number(postId));
  const { data: currentProfile } = useGetCurrentProfile();
  const headerHeight = useHeaderHeight();

  const [refreshing, setRefreshing] = useState(false);
  const [visibleBorderHeader, setVisibleBorderHeader] = useState(false);
  const isNearBottom = useSharedValue(false);
  const setIsStaticTabBar = useTabBarStore(state => state.setIsStatic);
  const setCurrentRouteKey = useScrollPositionStore((state) => state.setCurrentRouteKey);
  // const { setScrollY, updateScrollDirection } = useScrollPositionStore();

  useFocusEffect(
    useCallback(() => {
      setCurrentRouteKey(`posts/${postId}`);
    }, [postId, setCurrentRouteKey])
  );

  const showActions = useCallback(async () => {
    if (!post) return;
    if (currentProfile?.id === post?.profile?.id) {
      await SheetManager.show('current-profile-post-actions', {
        payload: {
          postId: post?.id,
        },
        onClose: (returnValue) => {
          if (returnValue?.isDeleted) {
            router.back();
          }
        },
      });
    }
    else {
      await SheetManager.show('post-actions', {
        payload: {
          postId: post?.id,
        },
      });
    }
  }, [currentProfile?.id, post]);

  useEffect(() => {
    navigation.setOptions({
      name: 'posts/[id]',
      headerShown: false,
      getId: ({ params }: { params: { id: string } }) => params?.id,
    });
    setIsStaticTabBar(false);
  }, [navigation, setCurrentRouteKey, setIsStaticTabBar]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refetchPost(),
        refetchReplies(),
      ]);
    }
    finally {
      setRefreshing(false);
    }
  }, [refetchPost, refetchReplies]);

  const handleLoadMoreReplies = useCallback(() => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, isFetchingNextPage, hasNextPage]);

  // Use animated reaction to respond to scroll position changes
  useAnimatedReaction(
    () => {
      return isNearBottom.value;
    },
    (isAtBottom, previousIsAtBottom) => {
      if (isAtBottom && !previousIsAtBottom) {
        runOnJS(handleLoadMoreReplies)();
      }
    },
    [handleLoadMoreReplies]
  );

  const handleScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      const scrollY = event.contentOffset.y;
      const contentHeight = event.contentSize.height;
      const layoutHeight = event.layoutMeasurement.height;

      runOnJS(setVisibleBorderHeader)(scrollY > 20);

      // Check if user has scrolled to bottom (with threshold)
      const thresholdPoint = contentHeight * (1 - CONSTANTS.LOAD_MORE_THRESHOLD);
      const isAtBottom = (scrollY + layoutHeight) >= thresholdPoint;
      if (isAtBottom !== isNearBottom.value) {
        isNearBottom.value = isAtBottom;
      }
    },
  });

  if (isPending) return <LoadingScreen/>;
  else if (!post) return <NoResults/>;

  return (
    <SmoothKeyboardAvoidingView customInput={<ReplyForm/>}>
      <Header
        title="Post"
        headerLeft={<BackScreenButton/>}
        headerRight={(size) => (
          <View className="flex-row gap-3">
            <Icon name="bell" size={size} onPress={featureNotAvailable}/>
            <Icon name="dots.horizontal.circle" size={size} onPress={showActions}/>
          </View>
        )}
        borderVisible={visibleBorderHeader}
      />

      <View className="flex-1">
        <Animated.ScrollView
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{
            paddingTop: headerHeight,
            paddingBottom: TAB_BAR_CONFIG.TAB_BAR_HEIGHT,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          }
        >
          <ParentPost post={post}/>
          <Replies/>
        </Animated.ScrollView>
      </View>
    </SmoothKeyboardAvoidingView>
  );
}
