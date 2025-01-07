import { ActivityIndicator, View } from 'react-native';

export function PageLoading() {
  return (
    <View className="fixed h-full w-full inset-0 z-40 items-center justify-center">
      <ActivityIndicator size="large"/>
    </View>
  );
}