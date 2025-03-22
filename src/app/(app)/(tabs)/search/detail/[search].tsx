import {
  TextInput, View, Animated, Keyboard
} from 'react-native';
import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDebounce } from '@/hooks/useDebounce';
import { ProfilesList } from '@/components/app/app/search/detail/ProfilesList';
import { PostList } from '@/components/app/app/search/detail/PostList';
import { SearchInput } from '@/components/app/app/search/SearchInput';
import { featureNotAvailable } from '@/utils';
import { Header } from '@/components/layout/header';
import { SuggestNavigateSearch } from '@/components/app/app/search/SuggestNavigateSearch';
import { ProfileList } from '@/components/app/app/search/ProfileList';
import { useNavigation } from '@react-navigation/native';
import { useHeaderHeight } from '@/hooks/useHeaderHeight';
import { HEADER_CONFIG, TAB_HEIGHT } from '@/components/layout/constants';
import { Icon } from '@/components/common/Icon';
import { BackScreenButton } from '@/components/layout/header/BackScreenButton';

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
  const headerHeight = useHeaderHeight(tabs);
  const { search, type } = useLocalSearchParams<SearchScreenParams>();
  const [searchTerm, setSearchTerm] = React.useState(search);
  const navigation = useNavigation();
  const [isFocusedSearchInput, setFocusSearchInput] = React.useState(false);
  const searchInputRef = React.useRef<TextInput>(null);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (search) {
        setSearchTerm(search);
        Keyboard.dismiss();
      }
    });
    return unsubscribe;
  }, [navigation, search]);

  React.useEffect(() => {
    if (isFocusedSearchInput) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [fadeAnim, isFocusedSearchInput]);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const isProfileSearch = React.useMemo(() => type === 'profile', [type]);

  const handleSearchTermChange = React.useCallback((val: string) => {
    setSearchTerm(val);
  }, []);

  const handleDismissSearch = React.useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      searchInputRef.current?.blur();
      setFocusSearchInput(false);
    });
  }, [fadeAnim]);

  const handlePressSearchInput = useCallback(() => {
    setFocusSearchInput(true);
    searchInputRef.current?.focus();
  }, []);

  const navigateDetailSearch = useCallback(() => {
    router.push({
      pathname: '/search/detail/[search]',
      params: {
        search: searchTerm,
      },
    });
    setTimeout(() => {
      handleDismissSearch();
    }, 800);
  }, [handleDismissSearch, searchTerm]);

  const handleBack = React.useCallback(() => {
    if (isFocusedSearchInput) {
      searchInputRef.current?.blur();
      setFocusSearchInput(false);
    }
    else {
      router.setParams({});
      router.back();
    }
  }, [isFocusedSearchInput]);

  const headerLeft = React.useCallback(() => (
    <BackScreenButton onPress={handleBack} variant="icon" className='ml-2'/>
  ), [handleBack]);

  const headerMiddle = React.useCallback(() => (
    <View className="flex-1 w-full">
      <View className={`absolute inset-0 ${!isFocusedSearchInput ? 'z-10' : 'z-[-1]'}`}>
        <SearchInput
          value={searchTerm}
          onPress={handlePressSearchInput}
          editable={false}
        />
      </View>
      <View className={`absolute inset-0 ${isFocusedSearchInput ? 'z-10' : 'z-[-1]'}`}>
        <SearchInput
          ref={searchInputRef}
          onChangeText={handleSearchTermChange}
          value={searchTerm}
          onSubmitEditing={navigateDetailSearch}
          selectTextOnFocus={true}
        />
      </View>
    </View>
  ), [isFocusedSearchInput, searchTerm, handlePressSearchInput, handleSearchTermChange, navigateDetailSearch]);

  const headerRight = React.useCallback(() => (
    <Icon name="settings" size={HEADER_CONFIG.ICON_SIZE} onPress={featureNotAvailable}/>
  ), []);

  const searchResult = useMemo(() => (
    <Animated.View
      className="flex-1"
      style={{
        opacity: fadeAnim,
      }}
    >
      <View
        className="flex-1"
        style={{ paddingTop: headerHeight - TAB_HEIGHT }}
      >
        <SuggestNavigateSearch
          searchTerm={searchTerm}
          onDismiss={handleDismissSearch}
        />
        <ProfileList
          searchInputRef={searchInputRef}
          searchTerm={searchTerm}/>
      </View>
    </Animated.View>
  ), [fadeAnim, headerHeight, searchTerm, handleDismissSearch]);

  return (
    <SafeAreaView className="flex-1" edges={['left', 'right']}>
      <Header
        tabs={isFocusedSearchInput ? [] : tabs}
        headerLeft={headerLeft}
        headerMiddle={headerMiddle}
        headerRight={headerRight}
        headerLeftClassName="max-w-[35px]"
        headerRightClassName="max-w-[40px]"
        headerMiddleClassName="ml-14 mr-10"
      />
      {
        isFocusedSearchInput ?
          searchResult :
          (
            <View className="flex-1 pb-[2px]">
              {isProfileSearch ?
                (<ProfilesList
                  headerHeight={headerHeight}
                  searchTerm={debouncedSearchTerm}
                />) :
                (<PostList
                  headerHeight={headerHeight}
                  searchTerm={debouncedSearchTerm}
                  isLatest={type === 'latest'}
                />)}
            </View>
          )
      }
    </SafeAreaView>
  );
}