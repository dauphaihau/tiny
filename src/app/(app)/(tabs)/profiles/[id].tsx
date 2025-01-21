import { View, Pressable } from 'react-native';
import React from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { truncate, usernameWithPrefix } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { useGetCurrentProfile, useGetProfileById } from '@/services/profile.service';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Avatar } from '@/components/common/Avatar';
import { PageLoading } from '@/components/ui/PageLoading';
import { PROFILE } from '@/constants/profile';
import { ProfilePosts } from '@/components/app/app/profiles/[id]/ProfilePosts';
import { ProfilePostTabs } from '@/components/app/app/profiles/[id]/ProfilePostTabs';

export default function DetailProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: profile, isPending } = useGetProfileById(id);
  const { data: currentProfile } = useGetCurrentProfile();

  if (isPending) {
    return <PageLoading/>;
  }
  else if (profile) {
    return (
      <View>
        <View className="h-[16%] bg-zinc-100">
          <Pressable
            onPress={router.back}
            className="absolute top-16 left-5 p-2 bg-black/50 rounded-full"
          >
            <Ionicons name="chevron-back" size={15} color="white"/>
          </Pressable>
        </View>

        <View className="px-3">
          <View className="flex-row justify-between">
            <View className="gap-3 -mt-6">
              <Avatar path={profile?.avatar} className="size-16"/>
              <View>
                <Text className="font-bold text-xl">{truncate(profile?.first_name, PROFILE.MAX_USERNAME)}</Text>
                <Text className="text-zinc-500 text-lg">{usernameWithPrefix(profile?.username)}</Text>
              </View>
              {profile?.bio && <Text>{profile?.bio}</Text>}
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
            {
              currentProfile?.id === profile.id &&
              <Button
                onPress={() => router.push('/modals/edit-profile')}
                size="sm"
                variant="secondary"
                className="rounded-full mt-3"
              >
                <Text>Edit profile</Text>
              </Button>
            }
          </View>
        </View>

        <View className='mt-4'>
          <ProfilePostTabs/>
        </View>
        <View className="border-[0.4px] border-zinc-300 w-full -mt-1.5"/>
        <View className="">
          <ProfilePosts/>
        </View>
      </View>
    );
  }
  else {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Profile not found</Text>;
      </View>
    );
  }
}
