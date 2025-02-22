import {
  Pressable, TextInput, View, Animated, TouchableOpacity
} from 'react-native';
import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Tabs } from '@/components/common/Tabs';
import { useDebounce } from '@/hooks/useDebounce';
import { ProfilesList } from '@/components/app/app/search/detail/ProfilesList';
import { PostsList } from '@/components/app/app/search/detail/PostsList';
import { SearchOverlay } from '@/components/app/app/search/SearchOverlay';
import { SearchInput } from '@/components/app/app/search/SearchInput';
import { featureNotAvailable } from '@/lib/utils';

const tabs = [
  { label: 'Top', value: 'default' },
  { label: 'Recent', value: 'latest' },
  { label: 'Profiles', value: 'profile' },
];

export type SearchScreenParams = {
  search: string;
  type?: 'default' | 'latest' | 'profile';
};

export default function DetailSearchScreen() {
  const { search, type } = useLocalSearchParams<SearchScreenParams>();
  const [searchTerm, setSearchTerm] = React.useState(search);

  React.useEffect(() => {
    if (search) {
      setSearchTerm(search);
    }
  }, [search]);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [isFocusedSearchInput, setFocusSearchInput] = React.useState(false);
  const searchInputRef = React.useRef<TextInput>(null);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  const isProfileSearch = type === 'profile';

  const handleSearchTermChange = (val: string) => {
    setSearchTerm(val);
  };

  const handleDismissSearch = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      searchInputRef.current?.blur();
      setFocusSearchInput(false);
    });
  };

  React.useEffect(() => {
    if (isFocusedSearchInput) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isFocusedSearchInput]);

  const backScreen = () => {
    router.setParams({});
    router.back();
  };

  const handleTabPress = (value: string) => {
    router.setParams({ type: value });
  };

  return (
    <SafeAreaView className="flex-1" edges={['top']}>
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center px-4 gap-5">
          <Pressable onPress={backScreen}>
            <Ionicons name="chevron-back" size={24} color="black"/>
          </Pressable>
          <SearchInput
            ref={searchInputRef}
            value={searchTerm}
            onChangeText={handleSearchTermChange}
            onFocus={() => setFocusSearchInput(true)}
          />
          <TouchableOpacity onPress={featureNotAvailable}>
            <Feather name="settings" size={20} color="black" className="opacity-70"/>
          </TouchableOpacity>
        </View>

        {isFocusedSearchInput && (
          <SearchOverlay
            fadeAnim={fadeAnim}
            searchInputRef={searchInputRef}
            onDismiss={handleDismissSearch}
            initialSearchTerm={searchTerm}
          />
        )}
        <View className="flex-1 pb-[2px]">
          {/*Search Tabs*/}
          <Tabs tabs={tabs} onPressTab={handleTabPress}/>

          {isProfileSearch ?
            (
              <ProfilesList searchTerm={searchTerm}/>
            ) :
            (
              <PostsList
                searchTerm={debouncedSearchTerm}
                isLatest={type === 'latest'}
              />
            )}
        </View>
      </View>
    </SafeAreaView>
  );
}