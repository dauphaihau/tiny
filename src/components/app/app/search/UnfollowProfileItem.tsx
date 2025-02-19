import { Text, TouchableWithoutFeedback, View } from 'react-native';
import { Avatar } from '@/components/common/Avatar';
import { router } from 'expo-router';
import { usernameWithPrefix } from '@/lib/utils';
import { FollowButton } from '@/components/common/FollowButton';
import React from 'react';

interface UnfollowProfileItemProps {
  id: string;
  username: string;
  first_name: string;
  followers: number;
  avatar?: string | null;
}

export function UnfollowProfileItem({
  id,
  username,
  first_name,
  followers,
  avatar,
}: UnfollowProfileItemProps) {

  const navigateDetailProfile = () => {
    router.push(`/search/profiles/${id}`);
  };

  return (
    <TouchableWithoutFeedback onPress={navigateDetailProfile}>
      <View className="flex-row px-4 py-2">
        <Avatar
          path={avatar}
          className="size-10 mr-3"
        />
        <View className="flex-1 gap-1">
          <View className="flex-row gap-1.5">
            <Text className="font-semibold">{first_name}</Text>
            <Text className="text-zinc-500">{usernameWithPrefix(username)}</Text>
          </View>
          <Text className="text-zinc-500 text-sm">
            {followers.toLocaleString()} followers
          </Text>
        </View>
        <FollowButton isFollowing={false} profileId={id}/>
      </View>
    </TouchableWithoutFeedback>
  );
}
