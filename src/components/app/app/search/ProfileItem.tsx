import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { FollowButton } from '@/components/common/FollowButton';
import React from 'react';
import { Text } from '@/components/ui/Text';
import { Avatar } from '@/components/common/Avatar';

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
      className="flex-row items-center px-4 py-3"
    >
      <Avatar
        path={avatar}
        className="size-10 mr-3"
      />
      <View className="flex-1">
        <Text className="font-semibold text-lg leading-none">{username}</Text>
        <Text className="text-muted-foreground text-lg mb-1.5 leading-5">{first_name}</Text>
      </View>
      <FollowButton profileId={id} isFollowing={is_following}/>
    </Pressable>
  );
} 