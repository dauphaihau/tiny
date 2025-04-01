import { View, TextInput } from 'react-native';
import React from 'react';
import { Text } from '@/components/ui/Text';
import { Avatar } from '@/components/common/Avatar';
import { Input } from '@/components/ui/Input';
import { useColorScheme } from '@/hooks/useColorScheme';

interface PostContentProps {
  profile: {
    avatar?: string;
    username?: string;
  };
  setContent: (text: string) => void;
  isSubmitting: boolean;
  inputRef: React.RefObject<TextInput>;
}

export function PostContent({
  profile,
  setContent,
  isSubmitting,
  inputRef,
}: PostContentProps) {
  const { themeColors } = useColorScheme();

  return (
    <View className="flex-row gap-4 pl-3">
      <Avatar path={profile?.avatar} className="size-12" />
      <View className="flex-1">
        <Text className="font-semibold text-lg leading-none">{profile?.username}</Text>
        <Input
          variant="none"
          size="none"
          scrollEnabled={false}
          autoFocus
          editable={!isSubmitting}
          placeholder="What's new"
          autoCapitalize="none"
          ref={inputRef}
          selectionColor={themeColors.foreground}
          keyboardType="default"
          onChangeText={(val) => setContent(val)}
          multiline
          numberOfLines={10}
          className="px-0"
          style={{ lineHeight: 19 }}
        />
      </View>
    </View>
  );
} 