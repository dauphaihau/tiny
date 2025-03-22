import {
  FlatList, TextInput, View
} from 'react-native';
import React from 'react';
import { ProfileItem } from './ProfileItem';
import { SearchSkeleton } from './SearchSkeleton';
import { useSearchProfiles } from '@/services/profile.service';
import { useDebounce } from '@/hooks/useDebounce';

interface ProfileListProps {
  searchTerm: string;
  searchInputRef: React.RefObject<TextInput>
}

export function ProfileList({ searchTerm, searchInputRef }: ProfileListProps) {
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { isPending, profiles } = useSearchProfiles({
    searchTerm: debouncedSearchTerm,
    pageSize: 10,
  });

  if (!searchTerm) return null;

  if (isPending) {
    return (
      <View>
        <SearchSkeleton/>
        <SearchSkeleton/>
        <SearchSkeleton/>
        <SearchSkeleton/>
        <SearchSkeleton/>
        <SearchSkeleton/>
        <SearchSkeleton/>
        <SearchSkeleton/>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <FlatList
        data={profiles}
        onScroll={() => {
          searchInputRef?.current?.blur();
        }}
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{
          paddingTop: 7,
        }}
        renderItem={({ item }) => (
          <ProfileItem
            id={item.id}
            username={item.username ?? ''}
            first_name={item.first_name}
            avatar={item.avatar}
            is_following={item.is_following}
          />
        )}
      />
    </View>
  );
}