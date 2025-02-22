import { View } from 'react-native';
import { Text } from '@/components/ui/Text';

export function ErrorCallout({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <View className="bg-[#f8dde0] justify-center p-4 rounded-md">
      <Text className="text-[#823030] font-medium">{message}</Text>
    </View>
  );
}