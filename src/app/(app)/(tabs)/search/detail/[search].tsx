import {
  Pressable, TextInput, View, Dimensions, Animated, TouchableOpacity
} from 'react-native';
import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Feather, FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Tabs } from '@/components/common/Tabs';
import { useDebounce } from '@/hooks/useDebounce';
import { ProfilesList } from '@/components/app/app/search/detail/ProfilesList';
import { PostsList } from '@/components/app/app/search/detail/PostsList';
import { SearchOverlay } from '@/components/app/app/search/SearchOverlay';
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

  const screenHeight = Dimensions.get('window').height;
  const tabBarHeight = 70;

  return (
    <SafeAreaView className="flex-1" edges={['top']}>
      <View style={{ height: screenHeight - tabBarHeight }}>
        {/* Header */}
        <View className="flex-row items-center px-4 gap-3">
          <Pressable onPress={backScreen}>
            <Ionicons name="chevron-back" size={24} color="black"/>
          </Pressable>
          <View className="flex-1 bg-zinc-100 rounded-full px-4 py-3 flex-row items-center">
            <FontAwesome name="search" size={16} color="gray"/>
            <TextInput
              ref={searchInputRef}
              value={searchTerm}
              autoCapitalize="none"
              className="ml-2 flex-1"
              placeholderTextColor="gray"
              onChangeText={handleSearchTermChange}
              onFocus={() => setFocusSearchInput(true)}
            />
          </View>
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
        {(
          <>
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
          </>
        )}
      </View>
    </SafeAreaView>
  );
}