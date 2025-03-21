import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import {
  Keyboard, TouchableWithoutFeedback, View
} from 'react-native';
import { Text } from '@/components/ui/Text';
import { Icon } from '@/components/common/Icon';

type Props = {
  title: string;
  onBack?: () => void
  children: React.ReactNode;
};

export const AuthScreenWrapper: React.FC<Props> = ({
  title,
  onBack,
  children,
}) => {

  return (
    <SafeAreaView className="flex-1">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="px-8">
          {
            onBack && (
              <View className="absolute top-5 left-8">
                <Icon onPress={onBack} name='chevron.left' size={24} weight="bold"/>
              </View>
            )
          }
          <View className="gap-4 mt-28 h-full">
            <Text className="font-semibold text-4xl">{title}</Text>
            {children}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};
