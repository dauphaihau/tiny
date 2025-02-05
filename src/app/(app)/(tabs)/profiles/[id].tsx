import {
  View, Pressable, ScrollView, RefreshControl, ActivityIndicator
} from 'react-native';
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
import { useGetPostsByProfile } from '@/services/post.service';
import { NonUndefined } from 'react-hook-form';
import { GetPostsByProfileParams } from '@/types/request/post';
import { FollowButton } from '@/components/app/app/profiles/[id]/FollowButton';

type SearchParams = {
  id: string
  type: NonUndefined<GetPostsByProfileParams['type']>
};

export default function DetailProfileScreen() {
  const { id: profileId, type = 'posts' } = useLocalSearchParams<SearchParams>();
  const { data: profile, isPending } = useGetProfileById(profileId);
  const { data: currentProfile } = useGetCurrentProfile();

  const {
    refetch,
  } = useGetPostsByProfile({
    limit: 10,
    page: 1,
    pr_id: profileId,
    type,
  });

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  if (isPending) {
    return <PageLoading/>;
  }
  else if (profile) {
    return (
      <View>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        >
          <View className="h-[150px] bg-zinc-100">
            <Pressable
              onPress={router.back}
              className="absolute top-16 left-5 p-2 bg-black/50 rounded-full"
            >
              <Ionicons name="chevron-back" size={15} color="white"/>
            </Pressable>
            {
              refreshing &&
              <View className='absolute top-16 left-1/2 -translate-x-1/2'>
                <ActivityIndicator />
              </View>
            }
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
                    <Text className="font-semibold">{profile?.following_count ?? 0}</Text>
                    <Text className="text-zinc-500">Following</Text>
                  </View>
                  <View className="flex-row gap-1">
                    <Text className="font-semibold">{profile?.followers_count ?? 0}</Text>
                    <Text className="text-zinc-500">Followers</Text>
                  </View>
                </View>
              </View>

              <View className='h-12 flex-row items-center gap-3'>
                <Pressable
                  onPress={() => router.push(`/messages/${profile?.id}`)}
                  className="p-2 rounded-full border border-zinc-200"
                >
                  <Ionicons name="mail-outline" size={15} color="black"/>
                </Pressable>
                {
                  currentProfile?.id === profile.id ?
                    <Button
                      onPress={() => router.push('/modals/edit-profile')}
                      size="sm"
                      variant="secondary"
                      className="rounded-full"
                    >
                      <Text>Edit profile</Text>
                    </Button> :
                    <FollowButton data={profile}/>
                }
              </View>
            </View>
          </View>

          <View className="mt-4">
            <ProfilePostTabs/>
          </View>
          <View className="border-[0.4px] border-zinc-300 w-full -mt-1.5"/>
          <View className="">
            <ProfilePosts/>
          </View>

        </ScrollView>
      </View>
    );
  }
  else {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Profile not found</Text>
      </View>
    );
  }
}
