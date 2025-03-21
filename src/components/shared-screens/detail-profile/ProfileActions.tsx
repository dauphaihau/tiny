import { View, ViewProps } from 'react-native';
import { Text } from '@/components/ui/Text';
import { router } from 'expo-router';
import { useGetCurrentProfile, useGetProfileById } from '@/services/profile.service';
import { GetProfileByIdResponse } from '@/types/request/profile/get-profile-by-id';
import { useRootNameTab } from '@/hooks/useRootNameTab';
import { FollowButton } from '@/components/common/FollowButton';
import { Icon } from '@/components/common/Icon';
import { Button } from '@/components/ui/Button';

interface ProfileActionsProps extends ViewProps {
  profile: GetProfileByIdResponse;
}

export function ProfileActions({ profile, ...props }: ProfileActionsProps) {
  const { data: currentProfile } = useGetCurrentProfile();
  const { refetch: refetchProfile } = useGetProfileById(profile.id);
  const rootNameTab = useRootNameTab();

  const navigateChatScreen = () => {
    if (!profile || !rootNameTab) return;
    router.push({
      pathname: `/${rootNameTab}/chat/[profile_id]`,
      params: {
        profile_id: profile.id,
        avatar: profile?.avatar ?? '',
        first_name: profile?.first_name ?? '',
      },
    });
  };

  return (
    <View {...props}>
      {
        currentProfile?.id === profile?.id ?
          (
            <Button
              radius="full"
              variant="outline"
              onPress={() => router.push('/modals/edit-profile')}
              className="px-5 py-1.5 h-10"
            >
              <Text className="font-semibold">Edit profile</Text>
            </Button>
          ) :
          (
            <View className="flex-row items-center gap-3">
              <Button
                onPress={navigateChatScreen}
                variant="outline"
                radius="full"
                size="none"
                className='size-10'
              >
                <Icon name="mail" size={15}/>
              </Button>

              <FollowButton
                onSuccess={refetchProfile}
                isFollowing={profile.is_following}
                profileId={profile.id}
              />
            </View>
          )
      }
    </View>
  );
}