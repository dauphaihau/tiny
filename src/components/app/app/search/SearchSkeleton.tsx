import { View } from 'react-native';

export function SearchSkeleton() {
  return (
    <View className="flex-row items-center px-4 py-4">
      <View className="w-10 h-10 rounded-full bg-secondary mr-3"/>
      <View className="flex-1">
        <View className="w-2/4 h-4 bg-secondary rounded mb-1"/>
        <View className="w-1/3 h-4 bg-secondary rounded"/>
      </View>
    </View>
  );
} 