import {
  Pressable, TextInput, TouchableOpacity, View 
} from 'react-native';
import { FontAwesome, Ionicons, Feather } from '@expo/vector-icons';
import React from 'react';
import { featureNotAvailable } from '@/lib/utils';

interface SearchHeaderProps {
  searchInputRef: React.RefObject<TextInput>;
  onDismiss: () => void;
  setInputValue: (value: string) => void;
  initialValue?: string; // Add this prop
}

export function SearchHeader({
  searchInputRef,
  onDismiss,
  setInputValue,
  initialValue = '',
}: SearchHeaderProps) {
  return (
    <View className="flex-row items-center px-4 gap-3">
      <Pressable onPress={onDismiss}>
        <Ionicons name="chevron-back" size={24} color="black"/>
      </Pressable>
      <View className="flex-1 bg-zinc-100 rounded-full px-4 py-3 flex-row items-center">
        <FontAwesome name="search" size={16} color="gray"/>
        <TextInput
          ref={searchInputRef}
          autoFocus
          autoCapitalize="none"
          placeholder="Search"
          className="ml-2 flex-1"
          placeholderTextColor="gray"
          onChangeText={setInputValue}
          defaultValue={initialValue}
        />
      </View>
      <TouchableOpacity onPress={featureNotAvailable}>
        <Feather name="settings" size={20} color="black" className="opacity-70"/>
      </TouchableOpacity>
    </View>
  );
}