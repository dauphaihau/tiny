import {
  Pressable, TextInput, TouchableOpacity, View 
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import React from 'react';
import { featureNotAvailable } from '@/lib/utils';
import { SearchInput } from './SearchInput';

interface SearchHeaderProps {
  searchInputRef: React.RefObject<TextInput>;
  onDismiss: () => void;
  setInputValue: (value: string) => void;
  initialValue?: string;
}

export function SearchHeader({
  searchInputRef,
  onDismiss,
  setInputValue,
  initialValue = '',
}: SearchHeaderProps) {
  return (
    <View className="flex-row items-center px-4 gap-5">
      <Pressable onPress={onDismiss}>
        <Ionicons name="chevron-back" size={24} color="black"/>
      </Pressable>
      <SearchInput
        ref={searchInputRef}
        autoFocus
        placeholder="Search"
        onChangeText={setInputValue}
        defaultValue={initialValue}
      />
      <TouchableOpacity onPress={featureNotAvailable}>
        <Feather name="settings" size={20} color="black" className="opacity-70"/>
      </TouchableOpacity>
    </View>
  );
}