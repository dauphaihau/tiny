import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className='flex-1 items-center justify-center p-12'>
        <Text className='font-semibold text-4xl'>This screen doesn't exist.</Text>
        <Link href="/" className='mt-12'>
          <Text className='text-blue-400 text-lg'>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}
