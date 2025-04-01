import React from 'react';
import { ToastConfig, ToastConfigParams } from 'react-native-toast-message';
import { BaseToast, BaseToastProps } from '@/components/toasts/BaseToast';
import { CreatePostToast } from '@/components/toasts/CreatePostToast';
import { Href } from 'expo-router';

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
      iconLeading={{ name: 'error' }}
    />
  ),
  info: ({ props }) => (
    <BaseToast
      {...props}
      iconLeading={{ name: 'info' }}
    />
  ),
  success: ({ props }) => (
    <BaseToast
      {...props}
      iconLeading={{ name: 'check' }}
    />
  ),
  createPost: ({ props }) => <CreatePostToast {...props} />,
};