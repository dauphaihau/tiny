import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import Toast, { ToastConfig, ToastConfigParams } from 'react-native-toast-message';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Href, Link } from 'expo-router';

const sizeIcon = 20;

interface BaseToastProps {
  message: string;
  renderLeading?: () => React.ReactNode;
  renderTrailing?: () => React.ReactNode;
}

interface PostProps extends BaseToastProps {
  detailPostHref: Href,
}

interface CustomToastConfig extends ToastConfig {
  createdPost: (params: ToastConfigParams<PostProps>) => React.ReactNode;
}

function BaseToast(props: BaseToastProps) {
  return (
    <View
      className="h-16 w-[90%] rounded-md bg-primary"
    >
      <View className="flex-row gap-2 p-4">
        {props.renderLeading && props.renderLeading()}
        <Text
          className="font-medium text-primary-foreground grow"
          style={{ flexGrow: 1 }}
        >
          {props?.message}
        </Text>
        {props.renderTrailing && props.renderTrailing()}
      </View>
    </View>
  );
}

export const toastConfig: CustomToastConfig = {
  error: ({ props }) => (
    <BaseToast
      {...props}
      renderLeading={() => (
        <Text className="text-primary-foreground">
          <MaterialIcons name="error-outline" size={sizeIcon}/>
        </Text>
      )}
    />
  ),
  success: ({ props }) => (
    <BaseToast
      {...props}
      renderLeading={() => (
        <Text className="text-primary-foreground">
          <Feather name="check" size={sizeIcon}/>
        </Text>
      )}
    />
  ),
  createdPost: ({ props }) => (
    <BaseToast
      {...props}
      renderLeading={() => (
        <Text className="text-primary-foreground">
          <Feather name="check" size={sizeIcon}/>
        </Text>
      )}
      renderTrailing={() => (
        <View>
          {
            props?.detailPostHref &&
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
  ),
};