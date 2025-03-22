import { Text, View } from 'react-native';
import React from 'react';

interface ErrorScreenProps {
  onRetry?: () => void;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({ onRetry }) => (
  <View className="h-full items-center justify-center gap-2">
    <Text className="text-muted-foreground">Sorry, Something went wrong</Text>
    <Text onPress={onRetry} className="text-muted-foreground font-bold">Try again</Text>
  </View>
);
