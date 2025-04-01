import { View } from 'react-native';
import React from 'react';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';

interface PostFooterProps {
  onSubmit: () => void;
  disabled: boolean;
  paddingBottom: number;
}

export function PostFooter({ onSubmit, disabled, paddingBottom }: PostFooterProps) {
  return (
    <View
      className="px-3 py-2"
      style={{
        paddingBottom,
      }}
    >
      <View className="flex-row items-center justify-between">
        <Text className="text-md text-zinc-400 font-medium">Anyone can reply & quote</Text>
        <Button
          onPress={onSubmit}
          disabled={disabled}
          radius="full"
          size="md"
          className="px-5"
        >
          <Text>Post</Text>
        </Button>
      </View>
    </View>
  );
} 