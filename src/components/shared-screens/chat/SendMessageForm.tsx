import { View } from 'react-native';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useGetCurrentProfile } from '@/services/profile.service';
import { useSendMessage } from '@/services/message.service';
import { Profile } from '@/types/models/profile';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { QuickResponseForm } from '@/components/common/QuickResponseForm';

type SearchParams = {
  profile_id: Profile['id'];
};

export function SendMessageForm() {
  const { profile_id } = useLocalSearchParams<SearchParams>();
  const queryClient = useQueryClient();
  const { data: currentProfile } = useGetCurrentProfile();
  const { mutateAsync: sendMessage } = useSendMessage();

  const onSubmit = async (content: string) => {
    if (!currentProfile || !content) {
      return;
    }
    const { error, data: newMessage } = await sendMessage({
      sender_id: currentProfile.id,
      receiver_id: profile_id,
      content,
    });
    if (!error) {
      await supabase
        .channel(`room:${currentProfile.id}-${profile_id}`)
        .send({
          type: 'broadcast',
          event: 'new_message',
          payload: newMessage,
        });

      await supabase
        .channel(`direct_message:${profile_id}`)
        .send({
          type: 'broadcast',
          event: 'new_message',
          payload: newMessage,
        });
      queryClient.invalidateQueries({
        queryKey: ['get-last-messages'],
      });
    }
  };

  return (
    <View className="mx-3 mb-3">
      <QuickResponseForm
        isPending={false}
        onSubmit={onSubmit}
        placeholder="Type a message..."
      />
    </View>
  );
}
