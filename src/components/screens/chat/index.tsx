import {
  ActivityIndicator,
  FlatList, KeyboardAvoidingView, Platform, SafeAreaView, Text, View
} from 'react-native';
import React from 'react';
import { SendMessageForm } from '@/components/screens/chat/SendMessageForm';
import { useGetMessages } from '@/services/message.service';
import { useLocalSearchParams } from 'expo-router';
import { useGetCurrentProfile } from '@/services/profile.service';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { Avatar } from '@/components/common/Avatar';
import { BackScreenButton } from '@/components/layout/BackScreenButton';
import { Profile } from '@/types/models/profile';
import { Message } from '@/components/screens/chat/Message';
import { useNavigation } from '@react-navigation/native';

type SearchParams = {
  profile_id: Profile['id']
  avatar: string
  first_name: Profile['first_name']
};

export default function ChatScreen() {
  const { profile_id, ...profile } = useLocalSearchParams<SearchParams>();
  const { data: currentProfile } = useGetCurrentProfile();
  const {
    messages,
    data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage,
  } = useGetMessages(profile_id);
  const navigation = useNavigation();

  React.useEffect(() => {
    navigation.setOptions({
      name: 'chat/[profile_id]',
      headerTitle: '',
      headerShadowVisible: false,
      getId: ({ params }: { params: { profile_id: string } }) => params?.profile_id,
      headerLeft: () => (
        <View className="flex-row items-center gap-3">
          <BackScreenButton/>
          <Avatar path={profile?.avatar} className="size-10"/>
          <Text className="font-semibold text-lg">{profile?.first_name}</Text>
        </View>
      ),
    });
  }, [navigation]);

  const loadMoreMessages = () => {
    if (hasNextPage) {
      fetchNextPage(); // Load the next page of messages when scrolled to the top
    }
  };

  if (isPending) {
    return <LoadingScreen/>;
  }
  return (
    <SafeAreaView className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 items-center"
        keyboardVerticalOffset={100}
      >
        <View className="flex-1 min-w-full relative pt-3">
          <View className="flex-1 min-w-full">
            {
              messages.length > 0 && currentProfile && data && (
                <FlatList
                  data={messages}
                  keyExtractor={(item) => item.id.toString()}
                  inverted
                  contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }} // Push messages to the bottom
                  onEndReached={loadMoreMessages} // Fetch more messages when reaching the top
                  onEndReachedThreshold={0.1} // Trigger load more when the user reaches within 10% of the top
                  ListFooterComponent={isFetchingNextPage && data.pages.length > 1 ?
                    <ActivityIndicator size="small"/> :
                    null
                  } // Show loader when fetching
                  renderItem={({ item, index }) => (
                    <Message
                      data={item}
                      previousMessage={messages[index + 1]}
                      nextMessage={messages[index - 1]}
                    />
                  )}
                />
              )
            }
          </View>

          <View className="py-2 px-3 fixed bottom-0 bg-transparent">
            <SendMessageForm/>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
