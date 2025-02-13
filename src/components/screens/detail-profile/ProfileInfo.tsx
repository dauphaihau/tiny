import { usernameWithPrefix } from '@/lib/utils';
import { truncate } from '@/lib/utils';
import { View, ViewProps } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Avatar } from '@/components/common/Avatar';
import { PROFILE } from '@/constants/profile';
import { GetProfileByIdResponse } from '@/types/request/profile';

type ProfileInfoProps = {
  profile: GetProfileByIdResponse
} & ViewProps;

export function ProfileInfo({ profile, ...props }: ProfileInfoProps) {
  return (
    <View {...props}>
      <Avatar path={profile?.avatar} className="size-16"/>
      <View>
        <Text className="font-bold text-xl">{truncate(profile?.first_name, PROFILE.MAX_USERNAME)}</Text>
        <Text className="text-zinc-500 text-lg">{usernameWithPrefix(profile?.username)}</Text>
      </View>
      {profile?.bio && <Text>{profile?.bio}</Text>}
      <View className="flex-row gap-2">
        <View className="flex-row gap-1">
          <Text className="font-semibold">{profile?.following_count ?? 0}</Text>
          <Text className="text-zinc-500">Following</Text>
        </View>
        <View className="flex-row gap-1">
          <Text className="font-semibold">{profile?.followers_count ?? 0}</Text>
          <Text className="text-zinc-500">Followers</Text>
        </View>
      </View>
    </View>

  );
}