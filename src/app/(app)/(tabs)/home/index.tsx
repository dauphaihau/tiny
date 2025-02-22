import { View } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import { Tabs } from '@/components/common/Tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PostList } from '@/components/app/app/home/PostList';

const tabs = [
  { label: 'For you', value: 'default' },
  { label: 'Following', value: 'following' },
];

export default function HomeScreen() {
  const onPressTab = (value: string) => {
    router.setParams({ type: value });
  };

  return (
    <SafeAreaView className='flex-1'>
      <View className="pt-8"/>
      <Tabs
        tabs={tabs}
        onPressTab={onPressTab}
      />
      <PostList/>
    </SafeAreaView>
  );
};
