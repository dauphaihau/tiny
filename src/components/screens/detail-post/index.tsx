import { useLocalSearchParams } from 'expo-router';
import { useGetDetailPost } from '@/services/post.service';
import React, { useState, useEffect, useCallback } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  View,
  ScrollView,
  NativeScrollEvent,
  NativeSyntheticEvent
} from 'react-native';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { NoResults } from '@/components/common/NoResults';
import { ReplyInput } from '@/components/screens/detail-post/ReplyInput';
import { ParentPost } from '@/components/screens/detail-post/ParentPost';
import { Replies } from '@/components/screens/detail-post/Replies';
import { useNavigation } from '@react-navigation/native';
import { BackScreenButton } from '@/components/layout/BackScreenButton';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const sizeIcon = 21;

export function DetailPostScreen() {
  const { id: postId } = useLocalSearchParams<{ id: string }>();
  const { post, isPending, refetch } = useGetDetailPost(Number(postId));
  const navigation = useNavigation();

  const [refreshing, setRefreshing] = useState(false);
  const [shadowVisible, setShadowVisible] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      name: 'posts/[id]',
      headerTitle: 'Post',
      headerShadowVisible: shadowVisible,
      getId: ({ params }: { params: { id: string } }) => params?.id,
      headerLeft: () => <BackScreenButton />,
      headerRight: () => (
        <View className="flex-row gap-3">
          <Feather name="bell" size={sizeIcon} />
          <MaterialCommunityIcons
            name="dots-horizontal-circle-outline"
            size={sizeIcon}
            color="black"
          />
        </View>
      ),
    });
  }, [navigation, shadowVisible]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setShadowVisible(scrollY > 20);
  };

  if (isPending) {
    return <LoadingScreen />;
  }
  else if (post) {
    return (
      <View className="h-full">
        <View className="flex-1">
          <ScrollView
            onScroll={handleScroll}
            scrollEventThrottle={16} // Ensures smooth updates
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <ParentPost post={post} />
            <Replies />
          </ScrollView>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={100}
          className="absolute bottom-0 left-0 right-0 bg-transparent"
        >
          <ReplyInput />
        </KeyboardAvoidingView>
      </View>
    );
  }
  return <NoResults />;
}
