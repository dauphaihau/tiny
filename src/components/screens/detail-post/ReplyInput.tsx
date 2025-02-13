import { TextInput, View } from 'react-native';
import React, { useState } from 'react';
import { useCreateReply, useGetDetailPost, useGetRepliesPost } from '@/services/post.service';
import { useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { useGetCurrentProfile } from '@/services/profile.service';
import { FontAwesome5 } from '@expo/vector-icons';
import { cn } from '@/lib/utils';

type SearchParams = Record<'id' | 'autoFocus', string>;

export function ReplyInput() {
  const { id, autoFocus } = useLocalSearchParams<SearchParams>();
  const { post, refetch: refetchDetailPost } = useGetDetailPost(Number(id));
  const { refetch: refetchReplies } = useGetRepliesPost(Number(id));

  const { data: profile } = useGetCurrentProfile();
  const [content, setContent] = useState<string>();
  const { isPending, mutateAsync: reply } = useCreateReply();
  const [isAutoFocus, setIsAutoFocus] = useState(!!autoFocus);

  const onSubmit = async () => {
    if(!post || !profile || !content) {
      return;
    }
    const { error } = await reply({
      parent_id: post.id,
      profile_id: profile.id,
      content: content,
    });
    if (!error) {
      setContent('');
      refetchDetailPost();
      refetchReplies();
    }
  };

  return (
    <View className={cn(
      'absolute bottom-2 px-4 transition-all duration-200',
      isAutoFocus ? 'translate-y-[-270px]' : 'translate-y-0'
    )}>
      <View className="flex-row gap-4 items-center">
        <TextInput
          value={content}
          multiline
          autoFocus={isAutoFocus}
          onFocus={() => setIsAutoFocus(true)}
          onBlur={() => setIsAutoFocus(false)}
          numberOfLines={4}
          placeholder={post?.profile?.first_name === profile?.first_name ? 'Add to post...' : `Reply to ${post?.profile?.first_name}...`}
          className="max-h-20 rounded-2xl border border-input bg-zinc-100 px-3 py-3 text-base native:leading-[1.25] text-foreground placeholder:text-muted-foreground w-[87%]"
          editable={!isPending}
          onChangeText={(val) => setContent(val)}
        />
        <Button disabled={!content} onPress={onSubmit} size="icon" className="rounded-full">
          <Text className="text-primary-foreground">
            <FontAwesome5 name="arrow-up" size={17} />
          </Text>
        </Button>
      </View>
    </View>
  );
}
