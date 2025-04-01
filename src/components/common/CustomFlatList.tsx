import {
  ActivityIndicator,
  FlatList,
  FlatListProps,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  View,
  ViewStyle
} from 'react-native';
import React, {
  memo, useCallback, useEffect, useRef, useState
} from 'react';
import { Separator } from './Separator';
import { NoResults } from './NoResults';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import * as Haptics from 'expo-haptics';
import { ErrorScreen } from '@/components/common/ErrorScreen';
import { Icon } from '@/components/common/Icon';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate
} from 'react-native-reanimated';
import { TAB_BAR_CONFIG } from '@/components/layout/constants';

// Memoized separator to prevent unnecessary re-renders
const MemoizedSeparator = memo(Separator);

// Threshold values for scroll behavior
// const SCROLL_THRESHOLD = 10;
const PULL_REFRESH_THRESHOLD = -50;

interface CustomFlatListProps<T> extends Omit<FlatListProps<T>, 'renderItem'> {
  // Required props
  data: T[];
  renderItem: (item: T) => React.ReactElement | null;

  // Optional props with defaults
  isLoading?: boolean;
  isRefreshing?: boolean;
  isLoadingMore?: boolean;
  isError?: boolean;
  hasMoreData?: boolean;
  headerHeight?: number;

  // Callbacks
  onRefresh?: () => Promise<unknown>;
  onLoadMore?: () => void;
  onScrollDirectionChange?: (isScrollingDown: boolean) => void;

  // Customization
  emptyComponent?: React.ReactNode;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  headerComponent?: React.ComponentType<unknown> | null;
  footerComponent?: React.ReactNode;
  showPullToRefreshIndicator?: boolean;
  contentContainerStyle?: ViewStyle;
  separatorComponent?: FlatListProps<T>['ItemSeparatorComponent'];
}

function CustomFlatListComponent<T>({
  data,
  renderItem,
  isLoading = false,
  isRefreshing = false,
  isError = false,
  isLoadingMore = false,
  hasMoreData = false,
  headerHeight = 0,
  onRefresh,
  onLoadMore,
  onScrollDirectionChange,
  emptyComponent,
  errorComponent,
  loadingComponent,
  headerComponent,
  footerComponent,
  keyExtractor,
  showPullToRefreshIndicator = true,
  contentContainerStyle,
  separatorComponent = MemoizedSeparator,
  onScroll: externalOnScroll,
  ...restProps
}: CustomFlatListProps<T>) {
  const [refreshing, setRefreshing] = useState(isRefreshing);
  const [isScrolling, setIsScrolling] = useState(false);
  const [pullToRefreshTriggered, setPullToRefreshTriggered] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [heightListHeader, setHeightListHeader] = useState(0);

  const flatListRef = useRef<FlatList<T>>(null);

  const refreshIndicatorOpacity = useSharedValue(0);

  // Update the refreshIndicatorOpacity value based on scroll position and refreshing state
  useEffect(() => {
    if (pullToRefreshTriggered || refreshing) {
      // When refresh is triggered or ongoing, show the indicator at full opacity
      refreshIndicatorOpacity.value = withTiming(1, { duration: 250 });
    }
    else if (lastScrollY <= 0 && isScrolling) {
      // Calculate refreshIndicatorOpacity based on scroll position
      refreshIndicatorOpacity.value = interpolate(
        lastScrollY,
        [PULL_REFRESH_THRESHOLD, 0],
        [1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      );
    }
    else {
      refreshIndicatorOpacity.value = withTiming(0, { duration: 250 });
    }
  }, [lastScrollY, isScrolling, pullToRefreshTriggered, refreshing, refreshIndicatorOpacity]);

  const animatedRefreshIndicatorStyle = useAnimatedStyle(() => {
    return {
      opacity: refreshIndicatorOpacity.value,
    };
  });

  // Handle refresh action
  const handleRefresh = useCallback(async () => {
    if (!onRefresh) return;

    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  }, [onRefresh]);

  // Scroll event handlers
  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    // Call external onScroll handler if provided
    if (externalOnScroll) {
      externalOnScroll(event);
    }

    const currentScrollY = event.nativeEvent.contentOffset.y;
    // const contentHeight = event.nativeEvent.contentSize.height;
    // const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;

    // Check for pull-to-refresh threshold and trigger refresh immediately
    if (currentScrollY <= PULL_REFRESH_THRESHOLD && !pullToRefreshTriggered && onRefresh) {
      setPullToRefreshTriggered(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      handleRefresh();
    }
    else if (currentScrollY > PULL_REFRESH_THRESHOLD && pullToRefreshTriggered) {
      setPullToRefreshTriggered(false);
    }

    // Handle scroll direction change notification
    // Only update if scroll has changed significantly to prevent excessive updates
    // if (onScrollDirectionChange && Math.abs(currentScrollY - lastScrollY) > SCROLL_THRESHOLD) {
    //   if (currentScrollY > lastScrollY &&
    //     currentScrollY > SCROLL_THRESHOLD &&
    //     currentScrollY + scrollViewHeight < contentHeight) {
    //     // Scrolling down
    //     onScrollDirectionChange(true);
    //   }
    //   else if (currentScrollY + SCROLL_THRESHOLD < lastScrollY || currentScrollY <= 0) {
    //     // Scrolling up or at the top
    //     onScrollDirectionChange(false);
    //   }
    //
    //   // Only update lastScrollY when direction is being checked
    //   setLastScrollY(currentScrollY);
    // }

    setLastScrollY(currentScrollY);
  }, [lastScrollY, onScrollDirectionChange, pullToRefreshTriggered, handleRefresh, onRefresh, externalOnScroll]);

  const handleScrollBegin = useCallback(() => {
    setIsScrolling(true);
  }, []);

  const handleScrollEnd = useCallback(() => {
    setIsScrolling(false);

    if (pullToRefreshTriggered && !refreshing) {
      setPullToRefreshTriggered(false);

      // Reset scroll position to top after pull-to-refresh is released
      setTimeout(() => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      }, 100); // Small delay to ensure the refresh has completed
    }
  }, [pullToRefreshTriggered, refreshing]);

  // Default list header component with pull-to-refresh indicator
  const DefaultHeaderComponent = useCallback(() => {
    return showPullToRefreshIndicator ? (
      <View
        className="items-center py-8"
        onLayout={(e) => {
          setHeightListHeader(e.nativeEvent.layout.height);
        }}
      >
        <Animated.View style={animatedRefreshIndicatorStyle}>
          {refreshing || pullToRefreshTriggered ? (
            <ActivityIndicator style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}/>
          ) : (
            <Icon name="arrow.down" size={21} weight="bold"/>
          )}
        </Animated.View>
      </View>
    ) : null;
  }, [pullToRefreshTriggered, refreshing, showPullToRefreshIndicator, animatedRefreshIndicatorStyle]);

  // Default list footer component with loading indicator
  const DefaultFooterComponent = useCallback(() => {
    return (
      <View>
        {separatorComponent && <MemoizedSeparator />}
        {isLoadingMore && (
          <View className="py-8">
            <ActivityIndicator/>
          </View>
        )}
        {footerComponent}
      </View>
    );
  }, [isLoadingMore, footerComponent, separatorComponent]);

  // Load more data when reaching the end of the list
  const onEndReached = useCallback(() => {
    if (hasMoreData && onLoadMore && !isLoadingMore) {
      onLoadMore();
    }
  }, [hasMoreData, onLoadMore, isLoadingMore]);

  // Custom render item wrapper to match FlatList expected format
  const renderItemWrapper: ListRenderItem<T> = useCallback(({ item }) => {
    // Ensure item is properly typed as T
    return renderItem(item as T);
  }, [renderItem]);

  // Default key extractor if not provided
  const defaultKeyExtractor = useCallback((item: T, index: number) => {
    return (item as unknown as { id: number })?.id?.toString() || index.toString();
  }, []);

  if (isLoading) return loadingComponent || <LoadingScreen/>;
  if (isError) return errorComponent || <ErrorScreen onRetry={handleRefresh}/>;
  if (data.length === 0) return emptyComponent || <NoResults message="Content not available"/>;

  return (
    <FlatList
      ref={flatListRef}
      data={data}
      renderItem={renderItemWrapper}
      keyExtractor={keyExtractor || defaultKeyExtractor}
      ItemSeparatorComponent={separatorComponent}
      ListHeaderComponent={headerComponent || DefaultHeaderComponent}
      ListFooterComponent={DefaultFooterComponent}
      onScroll={handleScroll}
      onEndReached={onEndReached}
      onScrollBeginDrag={handleScrollBegin}
      onScrollEndDrag={handleScrollEnd}
      onMomentumScrollBegin={handleScrollBegin}
      onMomentumScrollEnd={handleScrollEnd}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            progressViewOffset={headerHeight - heightListHeader}
          />
        ) : undefined
      }
      contentContainerStyle={{
        paddingTop: headerHeight - heightListHeader,
        paddingBottom: TAB_BAR_CONFIG.TAB_BAR_HEIGHT,
        ...contentContainerStyle,
      }}
      {...restProps}
    />
  );
}

// Export the component with its generic type parameter
export const CustomFlatList = memo(CustomFlatListComponent) as typeof CustomFlatListComponent;