import { Pressable, Text, View } from 'react-native';
import { Avatar } from '@/components/common/Avatar';
import { router } from 'expo-router';
import { FollowButton } from '@/components/common/FollowButton';
import { parseNotificationCreatedAt } from '@/lib/day';
import { useRootNameTab } from '@/hooks/useRootNameTab';
import { INotification } from '@/types/request/notification/get-notifications';

interface NotificationItemProps {
  data: INotification
}

const actionsLabels = {
  follow: 'Followed you',
  new_post: 'Add a new post',
  like: 'Liked your post',
  reply: 'Replied to your post',
};

export function NotificationItem({ data }: NotificationItemProps) {
  const rootNameTab = useRootNameTab();

  const handlePress = () => {
    if (!rootNameTab) return;
    
    switch (data.type) {
      case 'like':
      case 'reply':
      case 'new_post':
        router.push({
          pathname: `/${rootNameTab}/posts/[id]`,
          params: {
            id: data.entity.id, 
          },
        });
        break;
      case 'follow':
        router.push({
          pathname: `/${rootNameTab}/profiles/[id]`,
          params: {
            id: data.actor.id,
          },
        });
        break;
    }
  };

  if (!data) {
    return null;
  }

  return (
    <Pressable
      onPress={handlePress}
      className="flex-row p-4"
    >
      <Avatar
        path={data?.actor?.avatar}
        className="w-10 h-10 mr-3"
      />
      <View className="flex-1 gap-1">
        <View className="flex-row gap-1">
          <Text className="font-semibold">{data?.actor?.username}</Text>
          <Text className="font-medium text-zinc-400">·</Text>
          <Text className="font-medium text-zinc-400">{parseNotificationCreatedAt(data?.created_at)}</Text>
        </View>
        <Text className="text-zinc-400 text-md font-medium">{actionsLabels[data?.type]}</Text>
        {
          (
            data.type === 'new_post' ||
            data.type === 'like' ||
            data.type === 'reply'
          ) &&
          <Text>{data?.entity?.preview?.content}</Text>
        }
      </View>
      {
        data.type === 'follow' &&
        <FollowButton profileId={data?.actor?.id} isFollowing={data?.actor?.is_following}/>
      }
    </Pressable>
  );
}