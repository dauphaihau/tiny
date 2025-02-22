import { Pressable, View, ViewProps } from 'react-native';
import { Text } from '@/components/ui/Text';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/Button';
import { useGetCurrentProfile, useGetProfileById } from '@/services/profile.service';
import { GetProfileByIdResponse } from '@/types/request/profile/get-profile-by-id';
import { useRootNameTab } from '@/hooks/useRootNameTab';
import { FollowButton } from '@/components/common/FollowButton';

type ProfileActionsProps = {
  profile: GetProfileByIdResponse
} & ViewProps;

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
              onPress={() => router.push('/modals/edit-profile')}
              size="sm"
              variant="secondary"
              className="rounded-full"
            >
              <Text>Edit profile</Text>
            </Button>
          ) :
          (
            <View className="flex-row items-center gap-3">
              <Pressable
                onPress={navigateChatScreen}
                className="p-2 rounded-full border border-zinc-200"
              >
                <Ionicons name="mail-outline" size={15} color="black"/>
              </Pressable>
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