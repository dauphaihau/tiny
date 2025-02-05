import { View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import React from 'react';
import { useToggleFollow } from '@/services/following.service';
import { useLocalSearchParams } from 'expo-router';
import { GetProfileByIdResponse } from '@/types/request/profile';
import { Profile } from '@/types/models/profile';
import { useGetProfileById } from '@/services/profile.service';

interface FollowButtonProps {
  data: GetProfileByIdResponse;
}

export function FollowButton({ data }: FollowButtonProps) {
  const { id: profileId } = useLocalSearchParams<{ id: Profile['id'] }>();
  const { refetch: refetchProfile } = useGetProfileById(profileId);
  const { mutateAsync: toggleFollow } = useToggleFollow(profileId);
  const [isFollowing, setIsFollowing] = React.useState(data.is_following);

  const handleClick = async () => {
    const error = await toggleFollow();
    if (!error) {
      setIsFollowing(!isFollowing);
      refetchProfile();
    }
  };

  return (
    <View>
      {
        isFollowing ?
          (
            <Button
              onPress={handleClick}
              variant="outline"
              size="sm"
              className="rounded-full"
            >
              <Text>Unfollow</Text>
            </Button>
          ) :
          (
            <Button
              onPress={handleClick}
              size="sm"
              className="rounded-full"
            >
              <Text>Follow</Text>
            </Button>
          )
      }
    </View>
  );
}