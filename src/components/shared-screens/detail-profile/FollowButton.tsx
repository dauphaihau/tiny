import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import React from 'react';
import { useToggleFollow } from '@/services/following.service';
import { Profile } from '@/types/models/profile';

interface FollowButtonProps {
  profileId: Profile['id'];
  isFollowing: boolean;
  onSuccess?: () => void;
  revertTheme?: boolean;
}

const buttonStyles = {
  base: 'px-5 py-1.5 rounded-full',
  following: 'border-[0.3px] border-white',
  notFollowing: 'bg-white',
} as const;

const textStyles = {
  following: 'text-white font-semibold',
  notFollowing: 'font-semibold text-black',
} as const;

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
      <Pressable
        className={`${buttonStyles.base} ${
          isFollowing ? buttonStyles.following : buttonStyles.notFollowing
        }`}
        onPress={onPress}
      >
        <Text
          className={isFollowing ? textStyles.following : textStyles.notFollowing}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </Text>
      </Pressable>
    </View>
  );
}