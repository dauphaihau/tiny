import { Text, TouchableWithoutFeedback, View } from 'react-native';
import { Avatar } from '@/components/common/Avatar';
import { router } from 'expo-router';
import { FollowButton } from '@/components/common/FollowButton';
import React from 'react';
import { UnfollowedProfile } from '@/types/request/profile/get-unfollowed-profiles';

export function UnfollowProfileItem({
  id,
  username,
  first_name,
  followers_count,
  avatar,
}: UnfollowedProfile) {

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
        <View className="flex-1">
          <Text className="font-semibold">{username}</Text>
          <Text className="text-zinc-500 mb-0.5">{first_name}</Text>
          <Text className="text-sm">
            {followers_count.toLocaleString()} followers
          </Text>
        </View>
        <FollowButton isFollowing={false} profileId={id}/>
      </View>
    </TouchableWithoutFeedback>
  );
}
