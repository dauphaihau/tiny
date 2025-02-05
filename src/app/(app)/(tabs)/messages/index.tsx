import {
  FlatList, Pressable, Text, View
} from 'react-native';
import { useGetLastMessages } from '@/services/message.service';
import { PageLoading } from '@/components/ui/PageLoading';
import { Avatar } from '@/components/common/Avatar';
import React from 'react';
import { parseCreatedAt } from '@/lib/day';
import { router } from 'expo-router';
import { useGetCurrentProfile } from '@/services/profile.service';
import { Database } from '@/types/database.types';
import { InfiniteData } from '@tanstack/react-query';

type MessageItemProps = {
  item: Database['public']['Functions']['get_last_messages']['Returns'][0];
};

type MessageListProps = {
  data: InfiniteData<{
    data: MessageItemProps['item'][]
    nextPage: number | undefined
  }, unknown> | undefined
};

const MessageList = ({ data }: MessageListProps) => (
  <View className="px-4 mt-8">
    <FlatList
      data={data?.pages.flatMap((page) => page.data)}
      renderItem={({ item }) => (
        <MessageItem item={item}/>
      )}
      keyExtractor={(item) => item?.id?.toString()}
    />
  </View>
);

const MessageItem = ({ item }: MessageItemProps) => {
  const { data: currentProfile } = useGetCurrentProfile();
  return (
    <Pressable onPress={() => router.push(`/messages/${item?.receiver_id}`)}>
      <View className="flex-row items-center gap-3 mb-5">
        <Avatar className="size-12" path={item?.receiver?.avatar}/>
        <View>
          <View className="flex-row justify-between w-[90%]">
            <Text>{item?.receiver?.username}</Text>
            <Text className="font-medium text-zinc-400">
              {parseCreatedAt(item?.created_at)}
            </Text>
          </View>
          <View className="flex-row">
            {item?.sender_id === currentProfile?.id && (
              <Text className="text-zinc-500">You: </Text>
            )}
            <Text className="text-zinc-500">{item.content}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const NoResults = () => (
  <View className="h-full items-center justify-center">
    <Text>No results</Text>
  </View>
);

export default function RecentMessagesScreen() {
  const {
    data,
    isPending,
  } = useGetLastMessages();

  return (
    <View className="flex-1">
      {
        isPending ?
          (<PageLoading/>) :
          data ?
            (<MessageList data={data}/>) :
            (<NoResults/>)
      }
    </View>
  );
}
