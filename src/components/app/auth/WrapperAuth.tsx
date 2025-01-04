import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/Text';

type Props = {
  title: string;
  children: React.ReactNode;
};

export const WrapperAuthScreen: React.FC<Props> = ({
  title, children,
}) => {
  return (
    <SafeAreaView>
      <View className='px-8'>
        <View className='absolute top-5 left-8'>
          <MaterialIcons name="arrow-back-ios" size={24} onPress={() => router.replace('/')}/>
        </View>

        <View className='gap-4 justify-center h-full'>
          <Text className='font-semibold text-4xl'>{title}</Text>
          {children}
        </View>
      </View>
    </SafeAreaView>
  );
};
