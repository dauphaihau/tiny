import { View } from 'react-native';
import React from 'react';
import { SendMessageForm } from '@/components/shared-screens/chat/SendMessageForm';
import { useLocalSearchParams } from 'expo-router';
import { Avatar } from '@/components/common/Avatar';
import { BackScreenButton } from '@/components/layout/header/BackScreenButton';
import { useNavigation } from '@react-navigation/native';
import { MessageList } from '@/components/shared-screens/chat/MessageList';
import { useTabBarStore } from '@/stores/tab-bar.store';
import { Header } from '@/components/layout/header';
import { Icon } from '@/components/common/Icon';
import { SmoothKeyboardAvoidingView } from '@/components/common/SmoothKeyboardAvoidingView';
import { Text } from '@/components/ui/Text';

type SearchParams = {
  avatar: string
  username: string
};

export default function ChatScreen() {
  const { ...profile } = useLocalSearchParams<SearchParams>();
  const navigation = useNavigation();
  const setIsShowTabBar = useTabBarStore((state) => state.setIsShow);

  React.useEffect(() => {
    navigation.setOptions({
      name: 'chat/[profile_id]',
      headerShown: false,
      getId: ({ params }: { params: { profile_id: string } }) => params?.profile_id,
    });
    setIsShowTabBar(false);

    // Restore the tab bar when leaving this screen
    return () => {
      setIsShowTabBar(true);
    };
  }, [navigation, profile?.avatar, profile?.username, setIsShowTabBar]);

  return (
    <SmoothKeyboardAvoidingView paddingDuration={10} customInput={<SendMessageForm/>}>
      <Header
        headerLeft={
          (iconSize) => (
            <View className="flex-row items-center">
              <BackScreenButton>
                <Icon name="chevron.left" size={iconSize} weight="bold"/>
              </BackScreenButton>
              <Avatar path={profile?.avatar} className="size-10 mr-2 ml-2"/>
              <Text className="font-semibold text-lg">{profile?.username}</Text>
            </View>
          )
        }
      />
      <View className="flex-1">
        <MessageList/>
      </View>
    </SmoothKeyboardAvoidingView>
  );
}
