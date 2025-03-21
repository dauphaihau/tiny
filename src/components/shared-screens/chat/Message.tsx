import { IMessage } from '@/types/request/message';
import { useGetCurrentProfile } from '@/services/profile.service';
import dayjs from 'dayjs';
import { View } from 'react-native';
import React from 'react';
import { Text } from '@/components/ui/Text';

type MessageProps = {
  data: IMessage
  nextMessage?: IMessage
  previousMessage?: IMessage
};

export const Message = ({ data, nextMessage, previousMessage }: MessageProps) => {
  const { data: currentProfile } = useGetCurrentProfile();
  const isSentByCurrentUser = data.sender_id === currentProfile?.id;

  const timeMessage = dayjs(data.created_at).format('HH:mm');

  const isDifferentDay =
    !previousMessage || !dayjs(data.created_at).isSame(dayjs(previousMessage.created_at), 'day');

  const isToday = dayjs(data.created_at).isSame(dayjs(), 'day');
  const isYesterday = dayjs(data.created_at).isSame(dayjs().subtract(1, 'day'), 'day');
  const isSameYear = dayjs(data.created_at).isSame(dayjs(), 'year');

  const dayMessage = isDifferentDay ?
    isToday ?
      'Today' :
      isYesterday ?
        'Yesterday' :
        isSameYear ?
          dayjs(data.created_at).format('dddd, D MMMM') :
          dayjs(data.created_at).format('D MMMM YYYY') :
    null;

  const shouldShowTime =
    !nextMessage ||
    nextMessage.sender_id !== data.sender_id ||
    (nextMessage && dayjs(nextMessage.created_at).diff(dayjs(data.created_at), 'minute') >= 10);

  return (
    <View className='px-3'>
      {isDifferentDay && <Text className="text-center font-semibold text-sm mb-5">{dayMessage}</Text>}
      <View className={`flex-row ${isSentByCurrentUser ? 'justify-end' : 'justify-start'} mb-2`}>

        <View className={`px-3 py-2 rounded-2xl ${isSentByCurrentUser ? 'bg-border' : 'border border-input bg-background'}`}>
          <Text className='text-lg'>{data.content}</Text>
        </View>

      </View>
      {shouldShowTime && (
        <Text
          className={`
          ${isSentByCurrentUser ? 'text-right' : 'text-left'}
          text-muted-foreground text-xs mb-4
        `}
        >{timeMessage}</Text>
      )}
    </View>
  );
};
