import { TextInput, View } from 'react-native';
import React, { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { useGetCurrentProfile } from '@/services/profile.service';
import { FontAwesome5 } from '@expo/vector-icons';
import { useSendMessage } from '@/services/message.service';

type SearchParams = Record<'receiver_id', string>;

export function MessageInput() {
  const { receiver_id } = useLocalSearchParams<SearchParams>();
  const { data: currentProfile } = useGetCurrentProfile();
  const [content, setContent] = useState<string>();
  const { isPending, mutateAsync: sendMessage } = useSendMessage();
  const [isAutoFocus, setIsAutoFocus] = useState(false);

  const onSubmit = async () => {
    if(!currentProfile || !content) {
      return;
    }
    const { error } = await sendMessage({
      sender_id: currentProfile.id,
      receiver_id,
      content,
    });
    if (!error) {
      setContent('');
    }
  };

  return (
    <View className="flex-row gap-4 items-center">
      <TextInput
        value={content}
        multiline
        autoFocus={isAutoFocus}
        onFocus={() => setIsAutoFocus(true)}
        onBlur={() => setIsAutoFocus(false)}
        numberOfLines={4}
        placeholder='Start a messages'
        className="max-h-20 rounded-2xl border border-input bg-zinc-10 px-3 py-3 text-base native:leading-[1.25] text-foreground placeholder:text-muted-foreground w-[87%]"
        editable={!isPending}
        onChangeText={(val) => setContent(val)}
      />
      <Button disabled={!content} onPress={onSubmit} size="icon" className="rounded-full">
        <Text className="text-primary-foreground">
          <FontAwesome5 name="arrow-up" size={17} />
        </Text>
      </Button>
    </View>
  );
}
