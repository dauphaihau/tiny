import { Text, View } from 'react-native';
import React from 'react';

interface NoResultsProps {
  message?: string;
}

export const NoResults = ({
  message = 'No results',
}: NoResultsProps) => (
  <View className="h-full items-center justify-center">
    <Text className="text-muted-foreground">{message}</Text>
  </View>
);
