import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import React from 'react';
import { useToggleFollow } from '@/services/following.service';
import { Profile } from '@/types/models/profile';
import { Button } from '@/components/ui/Button';

interface FollowButtonProps {
  profileId: Profile['id'];
  isFollowing: boolean;
  onSuccess?: () => void;
  revertTheme?: boolean;
}

export function FollowButton({
  profileId,
  isFollowing: initialIsFollowing,
  onSuccess = () => {},
}: FollowButtonProps) {
  const { mutateAsync: toggleFollow } = useToggleFollow(profileId);
  const [isFollowing, setIsFollowing] = React.useState(initialIsFollowing);

  const onPress = async () => {
    const error = await toggleFollow();
    if (!error) {
      setIsFollowing(!isFollowing);
      onSuccess();
    }
  };

  return (
    <View>
      <Button
        variant={isFollowing ? 'outline' : 'filled'}
        onPress={onPress}
        className="px-5 py-1.5 h-10"
        radius="full"
      >
        <Text>{isFollowing ? 'Following' : 'Follow'}</Text>
      </Button>
    </View>
  );
}