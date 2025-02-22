import {
  Animated, Dimensions, Pressable,
  TextInput, View
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useCreateReply, useGetDetailPost, useGetRepliesPost } from '@/services/post.service';
import { useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { useGetCurrentProfile } from '@/services/profile.service';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { featureNotAvailable } from '@/lib/utils';
import Ionicons from '@expo/vector-icons/Ionicons';

const sizeIconInput = 20;

type SearchParams = Record<'id' | 'autoFocus', string>;

export function ReplyInput() {
  const { id, autoFocus } = useLocalSearchParams<SearchParams>();
  const { post, refetch: refetchDetailPost } = useGetDetailPost(Number(id));
  const { refetch: refetchReplies } = useGetRepliesPost(Number(id));

  const { data: profile } = useGetCurrentProfile();
  const [content, setContent] = useState<string>();
  const { isPending, mutateAsync: reply } = useCreateReply();
  const [isAutoFocus, setIsAutoFocus] = useState(!!autoFocus);

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
    if (!post || !profile || !content) {
      return;
    }
    const { error } = await reply({
      parent_id: post.id,
      profile_id: profile.id,
      content: content.trim(),
    });
    if (!error) {
      setContent('');
      refetchDetailPost();
      refetchReplies();
    }
  };

  return (
    <View className="py-3 px-3">
      <View className="flex-row gap-4 items-center">
        <View className={`flex-1 rounded-2xl border border-input bg-zinc-100 px-3 relative ${content ? 'pr-16' : ''}`}>
          <TextInput
            value={content}
            multiline
            autoCapitalize="none"
            autoFocus={isAutoFocus}
            onFocus={() => setIsAutoFocus(true)}
            onBlur={() => setIsAutoFocus(false)}
            numberOfLines={4}
            placeholder={post?.profile?.first_name === profile?.first_name ? 'Add to post...' : `Reply to ${post?.profile?.first_name}...`}
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
    </View>
  )
}
