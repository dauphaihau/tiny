import {
  Pressable, View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { router } from 'expo-router';
import { Icon } from '@/components/common/Icon';
import { Text } from '@/components/ui/Text';

interface SuggestNavigateSearchProps {
  searchTerm: string;
  onDismiss: () => void;
}

export function SuggestNavigateSearch({ searchTerm, onDismiss }: SuggestNavigateSearchProps) {
  const navigateDetailSearch = () => {
    router.push({
      pathname: '/search/detail/[search]',
      params: {
        search: searchTerm,
      },
    });
    setTimeout(() => {
      onDismiss();
    }, 800);
  };

  if (!searchTerm) return null;

  return (
    <Pressable
      onPress={navigateDetailSearch}
      className="flex-row px-4 py-3 "
    >
      <View className="size-8 rounded-full mr-3 items-center justify-center">
        <Icon name="search" size={16} color="gray" className="opacity-80" weight="bold"/>
      </View>
      <View className="justify-center flex-1 min-w-0 mr-2">
        <Text className="text-lg font-medium" numberOfLines={1} ellipsizeMode="tail">
          Search for &#34;{searchTerm}&#34;
        </Text>
      </View>
      <View className="size-8 rounded-full items-center justify-center -mr-1">
        <Ionicons name="chevron-forward" size={16} color="gray"/>
      </View>
    </Pressable>
  );
}