import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useGetDetailPost } from '@/services/post.service';
import React, {
  useState, useEffect, useCallback, useRef 
} from 'react';
import { RefreshControl, View } from 'react-native';
import { NoResults } from '@/components/common/NoResults';
import { ReplyForm, ReplyFormRef } from '@/components/shared-screens/detail-post/ReplyForm';
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
import { useTabBarStore } from '@/stores/tab-bar.store';
import { useScrollPositionStore } from '@/stores/scroll-position.store';
import { TAB_BAR_CONFIG } from '@/components/layout/constants';
import { usePostRealtime } from '@/hooks/usePostRealtime';
import { useQueryClient } from '@tanstack/react-query';
import { IPost } from '@/types/components/common/post';
import { Button } from '@/components/ui/Button';

const CONSTANTS = {
  LOAD_MORE_THRESHOLD: 0.3,
};

// Custom hook to safely handle conditional usage of usePostRealtime
function useSafePostRealtime(post: IPost | undefined): IPost | undefined {
  const emptyPost: IPost = {} as IPost;
  const result = usePostRealtime(post || emptyPost);
  
  // Only return the result if we had a valid post
  return post ? result : undefined;
}

export function DetailPostScreen() {
  const queryClient = useQueryClient();
  const navigation = useNavigation();

  const { id: postId, focus } = useLocalSearchParams<{ id: string, focus?: string }>();
  const numericPostId = Number(postId);
  const replyFormRef = useRef<ReplyFormRef>(null);
  const { post: fetchedPost, isPending, refetch: refetchPost } = useGetDetailPost(numericPostId);

  // Replies query
  const {
    refetch: refetchReplies,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useGetRepliesPost(numericPostId);
  
  const { data: currentProfile } = useGetCurrentProfile();
  const headerHeight = useHeaderHeight();
  
  // Apply realtime updates to the post using the safe wrapper
  const post = useSafePostRealtime(fetchedPost);
  
  // When post changes from realtime updates, update the cache
  useEffect(() => {
    if (post && numericPostId) {
      queryClient.setQueryData(['detail-post', numericPostId], post);
    }
  }, [post, numericPostId, queryClient]);

  const [refreshing, setRefreshing] = useState(false);
  const [visibleBorderHeader, setVisibleBorderHeader] = useState(false);
  const isNearBottom = useSharedValue(false);
  const setIsStaticTabBar = useTabBarStore(state => state.setIsStatic);
  const setCurrentRouteKey = useScrollPositionStore((state) => state.setCurrentRouteKey);

  useFocusEffect(
    useCallback(() => {
      setCurrentRouteKey(`posts/${postId}`);
      
      // Focus the reply form if requested
      if (focus === 'reply' && replyFormRef.current) {
        // Use a short timeout to ensure form is rendered
        setTimeout(() => {
          replyFormRef.current?.focusInput();
        }, 300);
      }
    // }, [postId, setCurrentRouteKey, refetchPost, cachedPost, focus])
    }, [postId, setCurrentRouteKey, focus])
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

  if (isPending && !post) return <LoadingScreen/>;
  else if (!post) return <NoResults/>;

  return (
    <SmoothKeyboardAvoidingView customInput={<ReplyForm ref={replyFormRef} post={post}/>}>
      <Header
        title="Post"
        headerLeft={<BackScreenButton/>}
        headerRight={() => (
          <View className="flex-row gap-3">
            <Button icon="bell" variant="none" onPress={featureNotAvailable}/>
            <Button icon="dots.horizontal.circle" variant="none" onPress={showActions}/>
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
