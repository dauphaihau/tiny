import { SafeAreaView } from 'react-native-safe-area-context';
import { router, SplashScreen } from 'expo-router';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { View } from 'react-native';
import React, { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import * as Linking from 'expo-linking';
import { parseSupabaseUrl } from '@/lib/utils';

export default function WelcomeScreen() {
  const url = Linking.useURL();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('event', event);
      if (event === 'INITIAL_SESSION') {
        if (session) {
          router.replace('/(app)/(tabs)/home');
          setTimeout(() => {
            SplashScreen.hideAsync();
          }, 1500);
        }
        else {
          SplashScreen.hideAsync();
        }
      }
      else if (event === 'SIGNED_OUT') {
        if (router.canDismiss()) {
          router.dismissTo('/');
        }
        else router.replace('/');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (url) {
      const transformedUrl = parseSupabaseUrl(url);
      const parsedUrl = Linking.parse(transformedUrl);
      const access_token = parsedUrl.queryParams?.access_token;
      const refresh_token = parsedUrl.queryParams?.refresh_token;

      if (typeof access_token === 'string' && typeof refresh_token === 'string') {
        (async () => {
          // if verifying the token failed, it automatically emits event SIGNED_OUT
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
