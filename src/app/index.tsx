import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { View, Text as RNText } from 'react-native';
import { Input } from '@/components/ui/Input';

export default function WelcomeScreen() {
  return (
    <SafeAreaView>

      <View className="flex-row gap-20 bg-red-300">
        <Text>Text 2</Text>
        {/*<Text>Text 2</Text>*/}
      </View>

      <Text className="text-secondary">Text primary</Text>
      <Text className="text-5xl text-zinc-400">Text 2</Text>
      <RNText className="text-5xl text-red-300">Text 2</RNText>

      <Button className="my-4 mx-12">
        <Text>Click me</Text>
      </Button>

      <Input autoFocus/>

      <Link href="/(auth)/login">login</Link>
      <Link href="/loginn">login</Link>
      {/*<Image source={require('@/assets/images/react-logo.png')} style={{ alignSelf: 'center' }} />*/}
    </SafeAreaView>
  );
}
