import { TextInput, View } from 'react-native';
import React, { useState } from 'react';
import { useCreateReply, useGetDetailPost } from '@/services/post.service';
import { useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { useGetCurrentProfile } from '@/services/profile.service';
import { FontAwesome5 } from '@expo/vector-icons';

export function ReplyInput() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: post, refetch: reGetDetailPost } = useGetDetailPost(Number(id));
  const { data: profile } = useGetCurrentProfile();
  const [content, setContent] = useState<string>();
  const { isPending, mutateAsync: reply } = useCreateReply();

  const onSubmit = async () => {
    if(!post || !profile || !content) {
      console.log('post/profile/content be undefined');
      return;
    }
    const { error } = await reply({
      parent_id: post.id,
      profile_id: profile.id,
      content: content,
    });
    if (!error) {
      setContent('');
      reGetDetailPost();
    }
  };

  return (
    <View className="absolute bottom-3 left-0 px-4">
      <View className="flex-row gap-4 items-center">
        <TextInput
          value={content}
          multiline
          numberOfLines={4}
          placeholder={post?.profile?.username === profile?.username ? 'Add to post...' : `Reply to ${post?.profile?.username}...`}
          className="max-h-20 rounded-2xl border border-input bg-zinc-100 px-3 py-3 text-base native:leading-[1.25] text-foreground placeholder:text-muted-foreground w-[85%]"
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
