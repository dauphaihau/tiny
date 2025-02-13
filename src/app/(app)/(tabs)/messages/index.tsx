import {
  FlatList, View
} from 'react-native';
import { useGetLastMessages } from '@/services/message.service';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import React from 'react';
import { InfiniteData } from '@tanstack/react-query';
import { ILastMessage } from '@/types/request/message';
import { NoResults } from '@/components/common/NoResults';
import { ErrorScreen } from '@/components/common/ErrorScreen';
import { LastMessage } from '@/components/app/app/messages/LastMessage';

type MessageListProps = {
  data: InfiniteData<{
    data: ILastMessage[]
    nextPage: number | undefined
  }, unknown> | undefined
};

const LastMessageList = ({ data }: MessageListProps) => (
  <View className="px-4 mt-8">
    <FlatList
      data={data?.pages.flatMap((page) => page.data)}
      renderItem={({ item }) => <LastMessage item={item}/>}
      keyExtractor={(item) => item?.id?.toString()}
    />
  </View>
);

export default function RecentMessagesScreen() {
  const { data, isPending, isError } = useGetLastMessages();

  const hasData = !!data?.pages?.some(page => page.data.length > 0);

  if (isPending) {
    return <LoadingScreen/>;
  }
  if (isError) {
    return <ErrorScreen/>;
  }
  else if (hasData) {
    return (
      <View className="flex-1">
        <LastMessageList data={data}/>
      </View>
    );
  }
  return <NoResults/>;
}
