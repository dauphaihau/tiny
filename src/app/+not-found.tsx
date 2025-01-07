import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotFoundScreen() {
  return (
    <SafeAreaView>
      <Stack.Screen
        options={{
          title: 'Oops!',
          headerBackVisible: false,
        }}
      />
      <View className="items-center justify-center p-12 h-full">
        <Text className="font-semibold text-4xl">This screen doesn&#39;t exist.</Text>
        <Link href="/" className="mt-12">
          <Text className="text-blue-400 text-lg">Go to welcome screen!</Text>
        </Link>
      </View>
    </SafeAreaView>
  );
}
