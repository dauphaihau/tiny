import {
  FlatList, Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, Text, View
} from 'react-native';
import React from 'react';
import { MessageInput } from '@/components/app/app/messages/MessageInput';
import { useGetMessages } from '@/services/message.service';
import { useLocalSearchParams } from 'expo-router';
import { useGetCurrentProfile } from '@/services/profile.service';
import { PageLoading } from '@/components/ui/PageLoading';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database.types';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

type SearchParams = Record<'receiver_id', string>;

type Message = Database['public']['Tables']['messages']['Row'];

export default function ChatScreen() {
  const { receiver_id } = useLocalSearchParams<SearchParams>();
  const { data: currentProfile } = useGetCurrentProfile();
  const { data, isPending } = useGetMessages(receiver_id);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const flatListRef = React.useRef<FlatList>(null);

  React.useEffect(() => {
    if (data) {
      setMessages(data.pages.flatMap((page) => page.data));
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [data]);

  React.useEffect(() => {
    const messageChannel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (res) => {
          if (
            (res.new.sender_id === currentProfile?.id && res.new.receiver_id === receiver_id) ||
          (res.new.sender_id === receiver_id && res.new.receiver_id === currentProfile?.id)
          ) {
            setMessages((prevMessages) => [...prevMessages, res.new as Message]);
            setTimeout(() => {
              flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messageChannel);
    };
  }, [receiver_id, currentProfile]);

  return (
    <SafeAreaView className='flex-1'>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1 items-center'
        keyboardVerticalOffset={100}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View className='flex-1 min-w-full relative'>
            {
              isPending ?
                (<PageLoading />) :
                messages.length > 0 && currentProfile ?
                  (
                    <FlatList
                      data={messages}
                      ref={flatListRef}
                      keyExtractor={(item) => item.id.toString()}
                      renderItem={({ item }) => {
                        const isSentByCurrentUser = item.sender_id === currentProfile.id;
                        return (
                          <View className={`px-3 flex-row ${isSentByCurrentUser ? 'justify-end' : 'justify-start'} mb-2`}>
                            <View className={`px-4 py-3.5 rounded-2xl ${isSentByCurrentUser ? 'bg-zinc-200' : 'border border-zinc-200'}`}>
                              <Text>{item.content}</Text>
                            </View>
                          </View>
                        );
                      }}
                    />
                  ) :
                  (
                    <View className="h-full items-center justify-center">
                      <Text>No results</Text>
                    </View>
                  )
            }
            <View className='p-2'>
              <MessageInput />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}