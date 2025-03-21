import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/layout/header';
import { LastMessageList } from '@/components/app/app/messages/LastMessageList';

export default function RecentMessagesScreen() {
  return (
    <SafeAreaView className='flex-1' edges={['left', 'right']}>
      <Header title='Messages' />
      <LastMessageList/>
    </SafeAreaView>
  );
}