import React from 'react';
import { ToastConfig, ToastConfigParams } from 'react-native-toast-message';
import { BaseToast, BaseToastProps } from '@/components/toasts/BaseToast';
import { CreatePostToast } from '@/components/toasts/CreatePostToast';
import { Href } from 'expo-router';
import { Icon } from '@/components/common/Icon';

const SIZE_ICON_TOAST = 20;

export interface CreatePostToastProps extends BaseToastProps {
  detailPostHref: Href;
}

interface CustomToastConfig extends ToastConfig {
  createPost: (params: ToastConfigParams<CreatePostToastProps>) => React.ReactNode;
}

export const toastConfig: CustomToastConfig = {
  error: ({ props }) => (
    <BaseToast
      {...props}
      renderLeading={(currentTheme) => (
        <Icon name="error" color={currentTheme.primaryForeground} size={SIZE_ICON_TOAST}/>
      )}
    />
  ),
  info: ({ props }) => (
    <BaseToast
      {...props}
      renderLeading={(currentTheme) => (
        <Icon name="info" color={currentTheme.primaryForeground} size={SIZE_ICON_TOAST}/>
      )}
    />
  ),
  success: ({ props }) => (
    <BaseToast
      {...props}
      renderLeading={(currentTheme) => (
        <Icon color={currentTheme.primaryForeground} name="check" size={SIZE_ICON_TOAST}/>
      )}
    />
  ),
  createPost: ({ props }) => <CreatePostToast {...props} />,
};