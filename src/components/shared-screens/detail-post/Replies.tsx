import { Pressable, View } from 'react-native';
import React, { memo } from 'react';
import { Post } from '@/components/common/post';
import { useLocalSearchParams } from 'expo-router';
import { useGetRepliesPost } from '@/services/post/get-replies-post';
import { CustomFlatList } from '@/components/common/CustomFlatList';
import { Separator } from '@/components/common/Separator';
import { Text } from '@/components/ui/Text';
import { Icon } from '@/components/common/Icon';
import { featureNotAvailable } from '@/utils';
import { useColorScheme } from '@/hooks/useColorScheme';
const MemoizedPost = memo(Post);

export function Replies() {
  const { themeColors } = useColorScheme();
  const { id: postId } = useLocalSearchParams<{ id: string }>();
  const {
    replies,
    isPending,
    isFetchingNextPage,
    isError,
  } = useGetRepliesPost(Number(postId));

  if (isPending || replies.length === 0) {
    return null;
  }
  return (
    <View>
      <View>
        <Separator className="mx-4"/>
        <View className="flex-row justify-between py-3.5 px-4">
          <Text className="font-semibold">Replies</Text>
          <Pressable onPress={featureNotAvailable} className="flex-row items-center gap-1">
            <Text className="text-muted-foreground">View activity</Text>
            <Icon name="chevron.right" color={themeColors.mutedForeground} size={14} weight="bold"/>
          </Pressable>
        </View>
      </View>

      <Separator/>

      <CustomFlatList
        scrollEnabled={false}
        data={replies}
        renderItem={(item) => <MemoizedPost data={item}/>}
        ListHeaderComponent={null}
        isLoading={isPending}
        isError={isError}
        isLoadingMore={isFetchingNextPage}
      />
    </View>
  );
}
