import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/Text';
import { View } from 'react-native';
import { supabase } from '@/lib/superbase';
import { Button } from '@/components/ui/Button';
import { useGetCurrentUser } from '@/services/auth';

export default function FeedPage() {
  const { data: dataUser } = useGetCurrentUser();

  const logout = () => {
    supabase.auth.signOut();
  };

  return (
    <SafeAreaView>
      <View className="justify-center items-center">
        <Text>Hi, {dataUser?.first_name}</Text>
        <Button onPress={logout} className="mt-4">
          <Text>Logout</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
};
