import {
  Pressable, TextInput, TouchableOpacity, View 
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import React from 'react';
import { featureNotAvailable } from '@/utils';
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
    <View className="flex-row items-center gap-2 px-2">
      <Pressable onPress={onDismiss} className='w-10'>
        <Ionicons name="chevron-back" size={24} color="black"/>
      </Pressable>
      <SearchInput
        ref={searchInputRef}
        autoFocus
        className='flex-1'
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