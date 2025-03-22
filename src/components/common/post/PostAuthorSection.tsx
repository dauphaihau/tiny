import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Avatar } from '@/components/common/Avatar';
import { parsePostCreatedAt } from '@/utils/parse-post-created-at';
import { IPost } from '@/types/components/common/post';
import { useGetCurrentProfile } from '@/services/profile.service';
import { SheetManager } from 'react-native-actions-sheet';
import { useRootNameTab } from '@/hooks/useRootNameTab';
import { router } from 'expo-router';
import { Icon } from '@/components/common/Icon';
import { useColorScheme } from '@/hooks/useColorScheme';

interface PostAuthorSectionProps {
  data: IPost;
}

export const PostAuthorSection = ({ data }: PostAuthorSectionProps) => {
  const { data: currentProfile } = useGetCurrentProfile();
  const rootNameTab = useRootNameTab();
  const { themeColors } = useColorScheme();

  const navigateToProfile = () => {
    if (!data?.profile?.id || !rootNameTab) return;
    router.push(`/${rootNameTab}/profiles/${data.profile.id}`);
  };

  const showActions = async () => {
    if (currentProfile?.id === data.profile.id) {
      await SheetManager.show('current-profile-post-actions', {
        payload: {
          postId: data.id,
        },
      });
    }
    else {
      await SheetManager.show('post-actions', {
        payload: {
          postId: data.id,
        },
      });
    }
  };

  return (
    <View className="flex-row gap-4 px-4">
      <Pressable onPress={navigateToProfile} className='h-0'>
        <Avatar path={data?.profile?.avatar} className="size-10"/>
      </Pressable>

      <View className="flex-1 gap-1">
        <View className="flex-row justify-between  ">
          <View className="flex-row gap-1">
            <Pressable onPress={navigateToProfile}>
              <Text className="font-semibold text-lg leading-none">{data?.profile?.username}</Text>
            </Pressable>
            <Text className="font-medium text-muted-foreground leading-none">·</Text>
            <Text className="font-medium text-muted-foreground leading-none">{parsePostCreatedAt(data?.created_at)}</Text>
          </View>
          <Icon name='dots.horizontal' size={16} color={themeColors.mutedForeground} className="px-1 pb-2" onPress={showActions}/>
        </View>
        {data?.content ? <Text className="text-lg -mt-2.5">{data.content}</Text> : null}
      </View>
    </View>
  );
};