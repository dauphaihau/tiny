import { Alert } from 'react-native';
import { deletePost } from '@/services/post.service';
import { SheetManager, useSheetPayload } from 'react-native-actions-sheet';
import Toast from 'react-native-toast-message';
import { ButtonSheet } from '@/components/sheet/ButtonSheet';
import React from 'react';
import { supabase } from '@/lib/supabase';

export function DeleteButton() {
  const payload = useSheetPayload('current-profile-post-actions');

  const onPressDelete = () => {
    Alert.alert('Delete post', 'Are you sure?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await SheetManager.hide('current-profile-post-actions', {
              payload: { isDeleted: true },
            });

            Toast.show({
              type: 'success',
              props: {
                isLoading: true,
                message: 'Deleting...',
              },
            });

            await deletePost(payload.postId);

            await supabase.channel('posts').send({
              type: 'broadcast',
              event: 'delete_post',
              payload: {
                post_id: payload.postId,
              },
            });

            Toast.show({
              type: 'success',
              props: {
                message: 'Post deleted',
              },
            });
          }
          catch (error) {
            console.error('error', error);
            Toast.show({
              type: 'error',
              props: {
                message: 'Delete post failed',
              },
            });
          }
        },
      },
    ]);
  };

  return (
    <ButtonSheet
      onPress={onPressDelete}
      label="Delete"
      icon={{ name: 'trash' }}
      isDestructive
    />
  );
}