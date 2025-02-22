import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/Text';

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
    <SafeAreaView>
      <View className="px-8">
        {
          onBack &&
          <View className="absolute top-5 left-8">
            <Pressable onPress={onBack}>
              <MaterialIcons name="arrow-back-ios" size={24}/>
            </Pressable>
          </View>
        }
        <View className="gap-4 justify-center h-full">
          <Text className="font-semibold text-4xl">{title}</Text>
          {children}
        </View>
      </View>
    </SafeAreaView>
  );
};
