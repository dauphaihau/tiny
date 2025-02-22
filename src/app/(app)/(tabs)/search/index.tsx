import {
  View, Animated, Dimensions, TouchableOpacity
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { ProfileToggle } from '@/components/common/ProfileToggle';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchOverlay } from '@/components/app/app/search/SearchOverlay';
import { UnfollowedProfileList } from '@/components/app/app/search/UnfollowedProfileList';
import { TextInput } from 'react-native';
import { featureNotAvailable } from '@/lib/utils';
import { SearchInput } from '@/components/app/app/search/SearchInput';
import { TAB_BAR_HEIGHT } from '@/constants/layout';
import { Separator } from '@/components/common/Separator';

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

  return (
    <SafeAreaView className="flex-1">
      <View style={{ height: screenHeight - TAB_BAR_HEIGHT }}>
        {/*Header*/}
        <View className="flex-row items-center justify-between px-4 pb-3 gap-4">
          <ProfileToggle/>
          <SearchInput
            editable={false}
            placeholder='Search'
            onPress={() => setFocusSearchInput(true)}
          />
          <TouchableOpacity onPress={featureNotAvailable}>
            <Feather name="settings" size={20} color="black" className='opacity-70' />
          </TouchableOpacity>
        </View>
        <Separator/>

        {isFocusedSearchInput && (
          <SearchOverlay
            fadeAnim={fadeAnim}
            searchInputRef={searchInputRef}
            onDismiss={handleDismissSearch}
          />
        )}

        {/* Suggest unfollowed profiles */}
        <UnfollowedProfileList />
      </View>
    </SafeAreaView>
  );
}