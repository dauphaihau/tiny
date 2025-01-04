import { SafeAreaView } from 'react-native-safe-area-context';
import { router, SplashScreen } from 'expo-router';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { View } from 'react-native';
import { useEffect } from 'react';
import { supabase } from '@/lib/superbase';

const HOME_HREF = '/(app)/home';

export default function WelcomeScreen() {

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION') {
        if (session) {
          router.replace(HOME_HREF);
          setTimeout(() => {
            SplashScreen.hideAsync();
          }, 1000);
        }
        else {
          SplashScreen.hideAsync();
        }
      }
      else if (event === 'SIGNED_IN') {
        router.replace(HOME_HREF);
      }
      else if (event === 'SIGNED_OUT') {
        router.replace('/');
      }
      else if (event === 'PASSWORD_RECOVERY') {
        // handle password recovery event
      }
      else if (event === 'TOKEN_REFRESHED') {
        // handle token refreshed event
      }
      else if (event === 'USER_UPDATED') {
        // handle user updated event
      }
    });
  }, []);

  return (
    <SafeAreaView className="bg-white">
      <View className="px-6">
        <View className="h-[80%] justify-center items-center">
          <Text className="text-5xl font-semibold">Tiny</Text>
          <Text className="text-zinc-500">What&#39;s up?</Text>
        </View>

        <View className="gap-4">
          <Button onPress={() => router.push('/(auth)/register')}>
            <Text>Create account</Text>
          </Button>
          <Button variant="secondary" onPress={() => router.push('/(auth)/login')}>
            <Text>Login</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
