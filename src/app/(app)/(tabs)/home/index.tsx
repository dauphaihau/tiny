import { SafeAreaView } from 'react-native-safe-area-context';
import { PostList } from '@/components/app/app/home/PostList';
import { GetPostsTypes } from '@/types/request/post/get-posts';
import { Header } from '@/components/layout/header';
import { useHeaderHeight } from '@/hooks/useHeaderHeight';
import { useScrollPositionStore } from '@/stores/scroll-position.store';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { useTabBarStore } from '@/stores/tab-bar.store';

const tabs = [
  { label: 'For you', value: GetPostsTypes.ALL },
  { label: 'Following', value: GetPostsTypes.FOLLOWING },
];

export default function HomeScreen() {
  const headerHeight = useHeaderHeight(tabs);
  const setCurrentRouteKey = useScrollPositionStore((state) => state.setCurrentRouteKey);
  const setIsStaticTabBar = useTabBarStore((state) => state.setIsStatic);

  useFocusEffect(
    useCallback(() => {
      setCurrentRouteKey('home');
      setIsStaticTabBar(false);
    }, [setCurrentRouteKey, setIsStaticTabBar])
  );

  return (
    <SafeAreaView className="flex-1" edges={['left', 'right']}>
      <Header title="Home" tabs={tabs} isStatic={false} />
      <PostList headerHeight={headerHeight}/>
    </SafeAreaView>
  );
};
