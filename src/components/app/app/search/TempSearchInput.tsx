import { Pressable, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export function TempSearchInput({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-1 bg-zinc-100 rounded-full px-4 py-3 flex-row items-center mx-4"
    >
      <FontAwesome name="search" size={16} color="gray"/>
      <Text className="ml-2 text-zinc-500">Search</Text>
    </Pressable>
  );
}
