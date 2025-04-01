import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { FollowButton } from '@/components/common/FollowButton';
import { useRootNameTab } from '@/hooks/useRootNameTab';
import { INotification } from '@/types/request/notification/get-notifications';
import { parseNotificationCreatedAt } from '@/utils/parse-noti-created-at';
import { Text } from '@/components/ui/Text';
import { Avatar } from '@/components/common/Avatar';

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

  const handlePressNoti = () => {
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

  const navigateProfileScreen = () => {
    if (!rootNameTab || !data?.actor?.id) return;
    router.push(`/${rootNameTab}/profiles/${data?.actor?.id}`);
  };

  if (!data) {
    return null;
  }

  return (
    <Pressable
      onPress={handlePressNoti}
      className="flex-row p-4"
    >
      <Avatar
        onPress={navigateProfileScreen}
        path={data?.actor?.avatar}
        className="size-10 mr-3"
      />
      <View className="flex-1 gap-1">
        <View className="flex-row gap-1">
          <Text className="font-semibold text-lg leading-none">{data?.actor?.username}</Text>
          <Text className="text-muted-foreground leading-none">·</Text>
          <Text className="text-muted-foreground leading-none">{parseNotificationCreatedAt(data?.created_at)}</Text>
        </View>
        <Text className="text-muted-foreground text-md">{actionsLabels[data?.type]}</Text>
        {
          (
            data.type === 'new_post' ||
            data.type === 'like' ||
            data.type === 'reply'
          ) && data?.entity?.preview?.content &&
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