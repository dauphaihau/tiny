import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import Toast, { ToastConfig, ToastConfigParams } from 'react-native-toast-message';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Link } from 'expo-router';

const sizeIcon = 20;

interface BaseToastProps {
  message: string;
  renderLeading?: () => React.ReactNode;
  renderTrailing?: () => React.ReactNode;
}

interface PostProps extends BaseToastProps {
  postId: string;
}

interface CustomToastConfig extends ToastConfig {
  createdPost: (params: ToastConfigParams<PostProps>) => React.ReactNode;
}

function BaseToast(props: BaseToastProps) {
  return (
    <View
      style={{ backgroundColor: 'black' }}
      className="h-16 w-[90%] rounded-md"
    >
      <View className="flex-row gap-2 p-4">
        {props.renderLeading && props.renderLeading()}
        <Text className="font-medium" style={{ flexGrow: 1, color: 'white' }}>{props?.message}</Text>
        {props.renderTrailing && props.renderTrailing()}
      </View>
    </View>
  );
}

export const toastConfig: CustomToastConfig = {
  error: ({ props }) => (
    <BaseToast
      {...props}
      renderLeading={() => (<MaterialIcons name="error-outline" size={sizeIcon} color="white"/>)}
    />
  ),
  createdPost: ({ props }) => (
    <BaseToast
      {...props}
      renderLeading={() => (<Feather name="check" size={sizeIcon} color="white"/>)}
      renderTrailing={() => (
        <View>
          {
            props?.postId &&
            <Link
              href={`/feeds/${props.postId}`}
              push
              onPress={() => Toast.hide()}
            >
              <Text className="font-semibold" style={{ color: 'white' }}>View</Text>
            </Link>
          }
        </View>
      )}
    />
  ),
};