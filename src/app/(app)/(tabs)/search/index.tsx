import {
  View, Animated,
  TouchableWithoutFeedback
} from 'react-native';
import React, { useCallback, useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UnfollowedProfileList } from '@/components/app/app/search/UnfollowedProfileList';
import { TextInput } from 'react-native';
import { featureNotAvailable } from '@/utils';
import { SearchInput } from '@/components/app/app/search/SearchInput';
import { Header } from '@/components/layout/header';
import { ProfileToggle } from '@/components/common/ProfileToggle';
import { ProfileList } from '@/components/app/app/search/ProfileList';
import { SuggestNavigateSearch } from '@/components/app/app/search/SuggestNavigateSearch';
import { useHeaderHeight } from '@/hooks/useHeaderHeight';
import { router } from 'expo-router';
import { HEADER_CONFIG, HEADER_PADDING_BOTTOM } from '@/components/layout/constants';
import { Icon } from '@/components/common/Icon';
import { Separator } from '@/components/common/Separator';
import { BackScreenButton } from '@/components/layout/header/BackScreenButton';

const HeaderRight = React.memo(function HeaderRight() {
  return (
    <Icon name="settings" size={HEADER_CONFIG.ICON_SIZE} onPress={featureNotAvailable}/>
  );
});

export default function SearchScreen() {
  const headerHeight = useHeaderHeight();
  const [isFocusedSearchInput, setFocusSearchInput] = React.useState(false);
  const searchInputRef = React.useRef<TextInput>(null);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  const [searchTerm, setSearchTerm] = React.useState('');

  const handleDismissSearch = useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      searchInputRef.current?.blur();
      setFocusSearchInput(false);
      setSearchTerm('');
    });
  }, [fadeAnim]);

  const handlePressSearchInput = useCallback(() => {
    setFocusSearchInput(true);
    searchInputRef.current?.focus();
  }, []);

  const handleSearchTermChange = React.useCallback((val: string) => {
    setSearchTerm(val);
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

  React.useEffect(() => {
    if (isFocusedSearchInput) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [fadeAnim, isFocusedSearchInput]);

  const renderHeaderLeft = useCallback(() => {
    if (isFocusedSearchInput) {
      return (
        <Animated.View style={{ opacity: fadeAnim }} className="ml-2">
          <BackScreenButton onPress={handleDismissSearch} variant="icon"/>
        </Animated.View>
      );
    }
    return <ProfileToggle />;
  }, [isFocusedSearchInput, fadeAnim, handleDismissSearch]);

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
        />
      </View>
    </View>
  ), [isFocusedSearchInput, searchTerm, handlePressSearchInput, handleSearchTermChange, navigateDetailSearch]);

  const searchResult = useMemo(() => (
    <TouchableWithoutFeedback onPress={handleDismissSearch}>
      <Animated.View
        className="flex-1"
        style={{
          opacity: fadeAnim,
        }}
      >
        <View
          className="flex-1"
          style={{ paddingTop: headerHeight + HEADER_PADDING_BOTTOM }}
        >
          <SuggestNavigateSearch
            searchTerm={searchTerm}
            onDismiss={handleDismissSearch}
          />
          <Separator/>
          <ProfileList
            searchInputRef={searchInputRef}
            searchTerm={searchTerm}
          />
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  ), [searchInputRef, fadeAnim, headerHeight, searchTerm, handleDismissSearch]);

  return (
    <SafeAreaView className="flex-1" edges={['left', 'right']}>
      <Header
        headerLeft={renderHeaderLeft}
        headerMiddle={headerMiddle}
        headerRight={<HeaderRight/>}
        headerLeftClassName="max-w-[35px]"
        headerRightClassName="max-w-[40px]"
        headerMiddleClassName="ml-14 mr-10"
        isStatic={false}
      />
      {isFocusedSearchInput ? searchResult : <UnfollowedProfileList headerHeight={headerHeight}/>}
    </SafeAreaView>
  );
}