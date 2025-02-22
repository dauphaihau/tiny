import {
  TextInput, View, Animated, Dimensions, Pressable,
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { useGetCurrentProfile } from '@/services/profile.service';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { useSendMessage } from '@/services/message.service';
import { Profile } from '@/types/models/profile';
import Ionicons from '@expo/vector-icons/Ionicons';
import { featureNotAvailable } from '@/lib/utils';

const sizeIconInput = 20;

type SearchParams = {
  profile_id: Profile['id'];
};

export function SendMessageForm() {
  const { profile_id } = useLocalSearchParams<SearchParams>();
  const { data: currentProfile } = useGetCurrentProfile();
  const [content, setContent] = useState<string>();
  const { isPending, mutateAsync: sendMessage } = useSendMessage();

  const screenWidth = Dimensions.get('window').width;
  const buttonPosition = useRef(new Animated.Value(screenWidth)).current; // Start off-screen

  useEffect(() => {
    Animated.timing(buttonPosition, {
      toValue: content ? 0 : screenWidth, // Move in when typing, move out when empty
      duration: 100,
      useNativeDriver: true,
    }).start();
  }, [content]);

  const onSubmit = async () => {
    if (!currentProfile || !content) {
      return;
    }
    const { error } = await sendMessage({
      sender_id: currentProfile.id,
      receiver_id: profile_id,
      content: content.trim(),
    });
    if (!error) {
      setContent('');
    }
  };

  return (
    <View className="flex-row items-center gap-4 w-full">
      <View className={`flex-1 rounded-2xl border border-input bg-zinc-100 px-3 relative ${content ? 'pr-16' : ''}`}>
        <TextInput
          value={content}
          autoCapitalize="none"
          multiline
          numberOfLines={4}
          placeholder="Start a message"
          className="max-h-20 py-3 text-base native:leading-[1.25] placeholder:text-muted-foreground"
          editable={!isPending}
          onChangeText={(val) => setContent(val)}
        />
        <View className="absolute right-5 top-1/2 -translate-y-1/2 flex-row gap-3">
          {!content && (
            <Pressable onPress={featureNotAvailable}>
              <Ionicons name="images-outline" size={sizeIconInput}/>
            </Pressable>
          )}
          {!content && (
            <Pressable onPress={featureNotAvailable}>
              <Ionicons name="mic-outline" size={sizeIconInput}/>
            </Pressable>
          )}
          <Pressable onPress={featureNotAvailable}>
            <AntDesign name="pluscircleo" size={sizeIconInput}/>
          </Pressable>
        </View>
      </View>

      <Animated.View
        style={{
          display: content ? 'flex' : 'none',
          transform: [{ translateX: buttonPosition }],
        }}
      >
        <Button
          disabled={!content?.trim()}
          onPress={onSubmit}
          size="icon"
          className="rounded-full"
        >
          <Text className="text-primary-foreground">
            <FontAwesome name="arrow-up" size={17}/>
          </Text>
        </Button>
      </Animated.View>
    </View>
  );
}
