import {
  FlatList, Pressable, Text, View 
} from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ProfileItem } from './ProfileItem';
import { SearchSkeleton } from './SearchSkeleton';
import { useGetSearchProfiles } from '@/services/profile.service';

type Profile = ReturnType<typeof useGetSearchProfiles>['profiles'][number];

interface SearchContentProps {
  searchTerm: string;
  isSearching: boolean;
  profiles: Profile[];
  onDismiss: () => void;
  navigateDetailSearch: () => void;
}

export function SearchContent({
  searchTerm,
  isSearching,
  profiles,
  onDismiss,
  navigateDetailSearch,
}: SearchContentProps) {
  return (
    <Pressable
      className="flex-1"
      onPress={onDismiss}
    >
      {searchTerm && (
        <View>
          <Pressable
            onPress={navigateDetailSearch}
            className="flex-row px-4 py-3 border-b border-zinc-200 mb-2"
          >
            <View className="size-8 rounded-full mr-3 items-center justify-center">
              <FontAwesome name="search" size={16} color="gray" className="opacity-80"/>
            </View>
            <View className="justify-center flex-1 min-w-0 mr-2">
              <Text className="text-lg font-medium" numberOfLines={1} ellipsizeMode="tail">
                Search for &#34;{searchTerm}&#34;
              </Text>
            </View>
            <View className="size-8 rounded-full items-center justify-center">
              <Ionicons name="chevron-forward" size={16} color="gray"/>
            </View>
          </Pressable>

          {isSearching ?
            (
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
            ) :
            profiles.length > 0 ?
              (
                <FlatList
                  data={profiles}
                  keyboardShouldPersistTaps="handled"
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
              ) :
              null}
        </View>
      )}
    </Pressable>
  );
}