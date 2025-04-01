import { TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import { Text } from '@/components/ui/Text';
import { Icon } from '@/components/common/Icon';
import { HEADER_CONFIG } from '@/components/layout/constants';

interface BackScreenButtonProps extends TouchableOpacityProps {
  child?: React.ReactNode;
  variant?: 'text' | 'icon';
  sizeIcon?: number;
}

export const BackScreenButton = ({
  children,
  variant,
  ...props
}: BackScreenButtonProps) => {
  return (
    <TouchableOpacity
      onPress={router.back}
      {...props}
    >
      {
        children ?
          children :
          variant === 'icon' ?
            (<Icon name="chevron.left" size={HEADER_CONFIG.ICON_SIZE} weight='bold'/>) :
            variant === 'text' ?
              (<Text className="text-lg">Cancel</Text>) :
              (
                <View className="flex-row items-center gap-1">
                  <Icon name="chevron.left" size={HEADER_CONFIG.ICON_SIZE - 2}/>
                  <Text className="text-xl">Back</Text>
                </View>
              )
      }
    </TouchableOpacity>
  );
};
