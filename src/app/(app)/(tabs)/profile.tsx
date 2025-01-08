import { View, Pressable } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import { usernameWithPrefix } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { useGetCurrentUser } from '@/services/user.service';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Avatar } from '@/components/common/Avatar';

export default function ProfileScreen() {
  const { data: dataUser } = useGetCurrentUser();
  return (
    <View>
      <View className="h-[36%] bg-zinc-100">
        <Pressable
          onPress={() => router.back()}
          className="absolute top-16 left-5 p-2 bg-black/50 rounded-full"
        >
          <Ionicons name="chevron-back" size={15} color="white"/>
        </Pressable>
      </View>

      <View className="px-3">
        <View className="flex-row justify-between">
          <View className="gap-3 -mt-6">
            <Avatar path={dataUser?.avatar} className='size-16'/>
            <View>
              <Text className="font-bold text-xl">{dataUser?.first_name}</Text>
              <Text className="text-zinc-500 text-lg">{usernameWithPrefix(dataUser?.username)}</Text>
            </View>
            {dataUser?.bio && <Text>{dataUser?.bio}</Text>}
            <View className="flex-row gap-2">
              <View className="flex-row gap-1">
                <Text className="font-semibold">0</Text>
                <Text className="text-zinc-500">Following</Text>
              </View>
              <View className="flex-row gap-1">
                <Text className="font-semibold">0</Text>
                <Text className="text-zinc-500">Followers</Text>
              </View>
            </View>
          </View>
          <Button
            onPress={() => router.push('/modals/edit-profile')}
            size="sm"
            variant="secondary"
            className="rounded-full mt-3"
          >
            <Text>Edit profile</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}
