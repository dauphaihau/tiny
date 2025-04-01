import { ActivityIndicator, View } from 'react-native';

export function LoadingScreen() {
  return (
    <View className="fixed h-full w-full inset-0 z-50 items-center justify-center">
      <ActivityIndicator />
    </View>
  );
}