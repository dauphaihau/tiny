import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import React from 'react';
import Toast from 'react-native-toast-message';
import { Link } from 'expo-router';
import { BaseToast, bastToastClasses } from '@/components/toasts/BaseToast';
import { CreatePostToastProps } from '@/constants/toast';

export function CreatePostToast(props: CreatePostToastProps) {

  return (
    <BaseToast
      {...props}
      iconLeading={{ name: 'check' }}
      renderTrailing={() => (
        <View>
          {
            !props.isLoading && props.detailPostHref &&
            <Link
              push
              href={props.detailPostHref}
              onPress={() => Toast.hide()}
            >
              <Text className={bastToastClasses.text}>View</Text>
            </Link>
          }
        </View>
      )}
    />
  );
}