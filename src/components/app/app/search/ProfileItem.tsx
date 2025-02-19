import { Pressable, Text, View } from 'react-native';
import { Avatar } from '@/components/common/Avatar';
import { router } from 'expo-router';
import { usernameWithPrefix } from '@/lib/utils';
import { FollowButton } from '@/components/common/FollowButton';

interface ProfileItemProps {
  id: string;
  username: string;
  first_name: string;
  avatar?: string | null;
  is_following?: boolean;
}

export function ProfileItem({
  id,
  username,
  first_name,
  avatar,
  is_following = false,
}: ProfileItemProps) {

  const handlePress = () => {
    router.push(`/search/profiles/${id}`);
  };

  return (
    <Pressable
      onPress={handlePress}
      className="flex-row items-center px-4 py-2 active:bg-gray-100"
    >
      <Avatar
        path={avatar}
        className="w-10 h-10 mr-3"
      />
      <View className="flex-1">
        <Text className="font-semibold">{first_name}</Text>
        <Text className="text-zinc-500">{usernameWithPrefix(username)}</Text>
      </View>
      <FollowButton profileId={id} isFollowing={is_following}/>
    </Pressable>
  );
} 