import { SafeAreaView } from 'react-native-safe-area-context';
import { router, SplashScreen } from 'expo-router';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { View } from 'react-native';
import React, { useEffect } from 'react';
import { supabase } from '@/lib/superbase';
import * as Linking from 'expo-linking';
import { useURL } from 'expo-linking';

const parseSupabaseUrl = (url: string) => {
  let parsedUrl = url;
  if (url.includes('#')) {
    parsedUrl = url.replace('#', '?');
  }

  return parsedUrl;
};

export default function WelcomeScreen() {
  const url = useURL();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION') {
        if (session) {
          router.replace('/(app)/home');
          setTimeout(() => {
            SplashScreen.hideAsync();
          }, 1500);
        }
        else {
          SplashScreen.hideAsync();
        }
      }
      else if (event === 'SIGNED_IN') {
        // router.replace(HOME_HREF);
      }
      else if (event === 'SIGNED_OUT') {
        if (router.canDismiss()) {
          router.dismissAll();
        }
        else router.replace('/');
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

  useEffect(() => {
    if (url) {
      const transformedUrl = parseSupabaseUrl(url);

      const parsedUrl = Linking.parse(transformedUrl);

      const access_token = parsedUrl.queryParams?.access_token;
      const refresh_token = parsedUrl.queryParams?.refresh_token;

      if (typeof access_token === 'string' && typeof refresh_token === 'string') {
        (async () => {
          const { data: { user } } = await supabase.auth.getUser(access_token);
          if (user) {
            await supabase.auth.setSession({
              access_token,
              refresh_token,
            });
            await supabase.auth.refreshSession();
            router.replace('/(auth)/reset-password');
          }
        })();
      }
    }
  }, [url]);

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
