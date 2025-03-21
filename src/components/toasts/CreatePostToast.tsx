import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import React from 'react';
import Toast from 'react-native-toast-message';
import { Link } from 'expo-router';
import { BaseToast } from '@/components/toasts/BaseToast';
import { CreatePostToastProps } from '@/constants/toast';
import { Icon } from '@/components/common/Icon';

const SIZE_ICON_TOAST = 20;

export function CreatePostToast(props: CreatePostToastProps) {

  return (
    <BaseToast
      {...props}
      renderLeading={(currentTheme) => (
        <Icon
          name="check"
          size={SIZE_ICON_TOAST}
          color={currentTheme.primaryForeground}
        />
      )}
      renderTrailing={() => (
        <View>
          {
            !props.isLoading && props.detailPostHref &&
            <Link
              push
              href={props.detailPostHref}
              onPress={() => Toast.hide()}
            >
              <Text className="font-semibold text-primary-foreground">View</Text>
            </Link>
          }
        </View>
      )}
    />
  );
}