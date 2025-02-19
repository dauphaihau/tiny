import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import React from 'react';
import { useToggleFollow } from '@/services/following.service';
import { Profile } from '@/types/models/profile';

interface FollowButtonProps {
  profileId: Profile['id'];
  isFollowing: boolean;
  onSuccess?: () => void;
}

export function FollowButton({
  onSuccess = () => {},
  ...props
}: FollowButtonProps) {
  const { mutateAsync: toggleFollow } = useToggleFollow(props.profileId);
  const [isFollowing, setIsFollowing] = React.useState(props.isFollowing);

  const onPress = async () => {
    const error = await toggleFollow();
    if (!error) {
      setIsFollowing(!isFollowing);
      onSuccess();
    }
  };

  return (
    <View>
      <Pressable
        className={`px-5 py-1.5 rounded-full ${
          isFollowing ?
            'border border-zinc-200 bg-white' :
            'bg-black'
        }`}
        onPress={onPress}
      >
        <Text
          className={`font-semibold ${
            isFollowing ? 'text-black' : 'text-white'
          }`}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </Text>
      </Pressable>
    </View>
  );
}