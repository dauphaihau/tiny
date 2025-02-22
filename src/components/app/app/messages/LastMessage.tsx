import { useGetCurrentProfile } from '@/services/profile.service';
import { useRootNameTab } from '@/hooks/useRootNameTab';
import { router } from 'expo-router';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { Pressable, Text, View } from 'react-native';
import { Avatar } from '@/components/common/Avatar';
import React from 'react';
import { ILastMessage } from '@/types/request/message';

type LastMessageProps = {
  item: ILastMessage
};

dayjs.extend(isToday);
dayjs.extend(isSameOrAfter);

const formatMessageTime = (messageCreatedAt: string) => {
  const date = dayjs(messageCreatedAt);
  const now = dayjs();

  if (date.isToday()) {
    return date.format('HH:mm'); // Today → "14:30"
  }
  else if (date.isSameOrAfter(now.subtract(1, 'week'), 'day')) {
    return date.format('ddd'); // Within a week → "Mon"
  }
  else if (date.year() === now.year()) {
    return date.format('D MMM'); // Same year → "12 Feb"
  }
  else {
    return date.format('D MMMM YYYY'); // Different year → "12 February 2020"
  }
};

export const LastMessage = ({ item }: LastMessageProps) => {
  const { data: currentProfile } = useGetCurrentProfile();
  const rootNameTab = useRootNameTab();

  const navigateChatScreen = () => {
    if (!item || !rootNameTab) return;
    router.push({
      pathname: `/${rootNameTab}/chat/[profile_id]`,
      params: {
        profile_id: item?.other_profile_id,
        avatar: item?.other_profile_avatar ?? '',
        first_name: item?.other_profile_first_name ?? '',
      },
    });
  };

  const navigateProfileScreen = () => {
    if (!rootNameTab || !item?.other_profile_id) return;
    router.push(`/${rootNameTab}/profiles/${item?.other_profile_id}`);
  };

  return (
    <Pressable onPress={navigateChatScreen}>
      <View className="flex-row items-center gap-3 mb-5">
        <Pressable onPress={navigateProfileScreen}>
          <Avatar className="size-12" path={item?.other_profile_avatar}/>
        </Pressable>
        <View className='flex-grow'>
          <View className="flex-row justify-between">
            <Text className="font-semibold">{item?.other_profile_first_name}</Text>
            <Text className="font-medium text-zinc-400">
              {formatMessageTime(item.created_at)}
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
