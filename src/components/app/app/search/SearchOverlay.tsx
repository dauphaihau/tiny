import {
  Animated, Dimensions, TextInput, View
} from 'react-native';
import React from 'react';
import { useGetSearchProfiles } from '@/services/profile.service';
import { router } from 'expo-router';
import { useDebounce } from '@/hooks/useDebounce';
import { SearchHeader } from './SearchHeader';
import { SearchContent } from './SearchContent';

interface SearchOverlayProps {
  fadeAnim: Animated.Value;
  searchInputRef: React.RefObject<TextInput>;
  onDismiss: () => void;
  initialSearchTerm?: string;
}

export function SearchOverlay({
  fadeAnim,
  searchInputRef,
  onDismiss,
  initialSearchTerm = '',
}: SearchOverlayProps) {
  const [inputValue, setInputValue] = React.useState(initialSearchTerm);
  const searchTerm = useDebounce(inputValue, 300);
  
  const { isPending: isSearching, profiles } = useGetSearchProfiles({
    searchTerm,
    pageSize: 10,
  });

  const screenHeight = Dimensions.get('window').height;
  const tabBarHeight = 70;

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

  return (
    <Animated.View
      className="absolute inset-0 bg-white z-10"
      style={{
        height: screenHeight - tabBarHeight,
        opacity: fadeAnim,
      }}
    >
      <View className="flex-1">
        <SearchHeader
          searchInputRef={searchInputRef}
          onDismiss={onDismiss}
          setInputValue={setInputValue}
          initialValue={initialSearchTerm}
        />
        <SearchContent
          searchTerm={searchTerm}
          isSearching={isSearching}
          profiles={profiles}
          onDismiss={onDismiss}
          navigateDetailSearch={navigateDetailSearch}
        />
      </View>
    </Animated.View>
  );
}