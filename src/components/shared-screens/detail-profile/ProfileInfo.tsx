import { truncate } from '@/utils';
import { View, ViewProps } from 'react-native';
import { Text } from '@/components/ui/Text';
import { PROFILE } from '@/constants/profile';
import { GetProfileByIdResponse } from '@/types/request/profile/get-profile-by-id';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { Avatar } from '@/components/common/Avatar';

interface ProfileInfoProps extends ViewProps {
  profile: GetProfileByIdResponse;
  animatedScale: Animated.SharedValue<number>;
}

export function ProfileInfo({
  profile, animatedScale,
  ...props
}: ProfileInfoProps) {

  const animatedStyle = useAnimatedStyle(() => {
    const scale = animatedScale.value;
    return {
      transform: [
        { scale },
        { translateY: Math.min((1 - scale) * 77, 42) },
      ],
    };
  });

  return (
    <View {...props}>
      <View className="gap-3">
        <Animated.View
          className="size-[80px] rounded-full justify-center items-center"
          style={animatedStyle}
        >
          <View className="absolute size-[80px] rounded-full bg-background"/>
          <Avatar
            path={profile?.avatar}
            className="size-[70px] border-0"
            contentFit="cover"
            transition={200}
          />
        </Animated.View>
        <View>
          <Text className="font-bold text-xl">{truncate(profile?.first_name, PROFILE.MAX_USERNAME)}</Text>
          <Text className="text-lg -mt-1 mb-1">{profile?.username}</Text>
          {profile?.bio && <Text className="text-lg">{profile?.bio}</Text>}
        </View>
        <View className="flex-row gap-2.5">
          <View className="flex-row gap-0.5">
            <Text className="font-semibold">{profile?.following_count ?? 0}</Text>
            <Text className="text-muted-foreground">Following</Text>
          </View>
          <View className="flex-row gap-0.5">
            <Text className="font-semibold">{profile?.followers_count ?? 0}</Text>
            <Text className="text-muted-foreground">Followers</Text>
          </View>
        </View>
      </View>
    </View>

  );
}