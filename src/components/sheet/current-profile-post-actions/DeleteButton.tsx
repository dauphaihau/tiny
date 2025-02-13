import { Alert } from 'react-native';
import { useDeletePost } from '@/services/post.service';
import { SheetManager, useSheetPayload } from 'react-native-actions-sheet';
import Toast from 'react-native-toast-message';
import { ButtonSheet } from '@/components/sheet/ButtonSheet';
import { Feather } from '@expo/vector-icons';
import React from 'react';

export function DeleteButton() {
  const payload = useSheetPayload('current-profile-post-actions');
  const { mutateAsync: deletePost } = useDeletePost(payload.postId);

  const onPressDelete = () => {
    Alert.alert('Delete post', 'Are you sure?', [
      {
        text: 'Cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const { error } = await deletePost();
          if (!error) {
            SheetManager.hide('current-profile-post-actions', {
              payload: true,
            });
            Toast.show({
              type: 'success',
              props: {
                message: 'Index deleted',
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
      textColorClassname="text-red-400"
      icon={(size) => (
        <Feather name='trash' size={size}/>
      )}
    />
  );
}