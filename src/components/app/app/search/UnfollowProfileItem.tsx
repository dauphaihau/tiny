import { TouchableWithoutFeedback, View } from 'react-native';
import { Avatar } from '@/components/common/Avatar';
import { router } from 'expo-router';
import { FollowButton } from '@/components/common/FollowButton';
import React from 'react';
import { UnfollowedProfile } from '@/types/request/profile/get-unfollowed-profiles';
import { Text } from '@/components/ui/Text';

export function UnfollowProfileItem({
  id,
  username,
  first_name,
  bio,
  avatar,
}: UnfollowedProfile) {

  const navigateDetailProfile = () => {
    router.push(`/search/profiles/${id}`);
  };

  return (
    <TouchableWithoutFeedback onPress={navigateDetailProfile}>
      <View className="px-4 py-3">
        <View className="flex-row">
          <Avatar
            path={avatar}
            className="size-10 mr-3"
          />
          <View className="flex-1">
            <Text className="font-semibold text-lg leading-none">{username}</Text>
            <Text className="text-muted-foreground text-lg leading-[21px]">{first_name}</Text>
            <View className='absolute right-1'>
              <FollowButton isFollowing={false} profileId={id}/>
            </View>
            {bio ? <Text className="text-lg">{bio}</Text> : null}
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
