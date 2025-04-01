import {
  View, Platform, KeyboardAvoidingView, ScrollView, ImageURISource
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { AuthWrapper } from '@/components/common/AuthWrapper';
import { useGetCurrentProfile } from '@/services/profile.service';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { BackScreenButton } from '@/components/layout/header/BackScreenButton';
import { PostContent } from '@/components/app/modals/new-post/PostContent';
import { PostActions } from '@/components/app/modals/new-post/PostActions';
import { PostFooter } from '@/components/app/modals/new-post/PostFooter';
import { ImageHandler } from '@/components/app/modals/new-post/ImageHandler';
import { useInputFocus } from '@/components/app/modals/new-post/useInputFocus';
import { usePostSubmission } from '@/components/app/modals/new-post/usePostSubmission';
import { ImagePreviews } from '@/components/app/modals/new-post/ImagePreviews';
import { POST_CONTENT_INDENT } from '@/components/app/modals/new-post/constants';

export default function NewPostScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const { data: currentProfile } = useGetCurrentProfile();
  const [content, setContent] = useState('');
  const { rootNameTab } = useLocalSearchParams();
  const [contentHeight, setContentHeight] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const { inputRef, forceFocus } = useInputFocus();
  const { isSubmitting, handleSubmit } = usePostSubmission({ 
    profileId: currentProfile?.id || '', 
    rootNameTab: rootNameTab as string, 
  });

  React.useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <BackScreenButton variant="text"/>
      ),
    });
  }, [navigation]);

  const onSubmit = async (sourceImages?: ImageURISource[]) => {
    await handleSubmit(content, sourceImages);
  };

  return (
    <AuthWrapper>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 72 : 0}
      >
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <ImageHandler>
              {({
                handleCameraPress, handleImagesPicked, sourceImages, removeImage, 
              }) => (
                <>
                  {/* ScrollView area for content */}
                  <View style={{ flex: 1 }}>
                    <ScrollView
                      style={{ paddingTop: 20 }}
                      scrollEnabled={contentHeight + 30 > containerHeight}
                      contentContainerStyle={{ flexGrow: 1 }}
                      keyboardShouldPersistTaps="always"
                      onLayout={(event) => {
                        setContainerHeight(event.nativeEvent.layout.height);
                      }}
                    >
                      <View
                        onLayout={(event) => {
                          setContentHeight(event.nativeEvent.layout.height);
                        }}
                      >
                        <PostContent
                          profile={{
                            avatar: currentProfile?.avatar || undefined,
                            username: currentProfile?.username || undefined,
                          }}
                          setContent={setContent}
                          isSubmitting={isSubmitting}
                          inputRef={inputRef}
                        />

                        <ImagePreviews
                          images={sourceImages || []}
                          onRemoveImage={removeImage}
                          contentContainerStyle={{
                            paddingLeft: POST_CONTENT_INDENT,
                            paddingRight: 12,
                          }}
                        />

                        <PostActions
                          onImagesPicked={(images) => {
                            handleImagesPicked(images);
                            forceFocus();
                          }}
                          onCameraPress={handleCameraPress}
                        />
                      </View>
                    </ScrollView>
                  </View>

                  <PostFooter
                    onSubmit={() => onSubmit(sourceImages)}
                    disabled={isSubmitting || (!content.trim() && !sourceImages?.length)}
                    paddingBottom={insets.top}
                  />
                </>
              )}
            </ImageHandler>
          </View>
        </View>
      </KeyboardAvoidingView>
    </AuthWrapper>
  );
}