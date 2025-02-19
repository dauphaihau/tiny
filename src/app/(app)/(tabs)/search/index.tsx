import {
  View, Animated, Dimensions, TouchableOpacity
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { ProfileToggle } from '@/components/common/ProfileToggle';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TempSearchInput } from '@/components/app/app/search/TempSearchInput';
import { SearchOverlay } from '@/components/app/app/search/SearchOverlay';
import { UnfollowedProfiles } from '@/components/app/app/search/UnfollowedProfiles';
import { TextInput } from 'react-native';
import { featureNotAvailable } from '@/lib/utils';

export default function SearchScreen() {
  const [isFocusedSearchInput, setFocusSearchInput] = React.useState(false);
  const searchInputRef = React.useRef<TextInput>(null);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

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

  const screenHeight = Dimensions.get('window').height;
  const tabBarHeight = 70;

  return (
    <SafeAreaView className="flex-1">
      <View style={{ height: screenHeight - tabBarHeight }}>
        {/*Header*/}
        <View className="flex-row items-center justify-between px-4 pb-3">
          <ProfileToggle/>
          <TempSearchInput onPress={() => setFocusSearchInput(true)}/>
          <TouchableOpacity onPress={featureNotAvailable}>
            <Feather name="settings" size={20} color="black" className='opacity-70' />
          </TouchableOpacity>
        </View>

        {isFocusedSearchInput && (
          <SearchOverlay
            fadeAnim={fadeAnim}
            searchInputRef={searchInputRef}
            onDismiss={handleDismissSearch}
          />
        )}

        {/* Suggest unfollowed profiles */}
        <UnfollowedProfiles />
      </View>
    </SafeAreaView>
  );
}