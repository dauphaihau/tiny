import {
  View, Pressable, ScrollView, RefreshControl, ActivityIndicator
} from 'react-native';
import React from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { useGetProfileById } from '@/services/profile.service';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { useGetPostsByProfile } from '@/services/post.service';
import { NonUndefined } from 'react-hook-form';
import { GetPostsByProfileParams } from '@/types/request/post';
import { NoResults } from '@/components/common/NoResults';
import { Tabs } from '@/components/common/Tabs';
import { ProfilePosts } from '@/components/screens/detail-profile/ProfilePosts';
import { ProfileInfo } from '@/components/screens/detail-profile/ProfileInfo';
import { ProfileActions } from '@/components/screens/detail-profile/ProfileActions';
import { useNavigation } from '@react-navigation/native';

const tabs = [
  { label: 'Posts', value: 'posts' },
  { label: 'Likes', value: 'likes' },
];

type SearchParams = {
  id: string
  type: NonUndefined<GetPostsByProfileParams['type']>
};

export function DetailProfileScreen() {
  const { id: profileId, type = 'posts' } = useLocalSearchParams<SearchParams>();
  const { data: profile, isPending } = useGetProfileById(profileId);
  const navigation = useNavigation();

  const {
    refetch,
  } = useGetPostsByProfile({
    pr_id: profileId,
    type,
  });

  React.useEffect(() => {
    navigation.setOptions({
      name: 'profiles/[id]',
      headerShown: false,
      getId: ({ params }: { params: { id: string } }) => params?.id,
    });
  }, [navigation]);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleTabPress = (value: string) => {
    router.setParams({ type: value });
  };

  if (isPending) {
    return <LoadingScreen/>;
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
              <ProfileInfo profile={profile} className="gap-3 -mt-6"/>
              <ProfileActions profile={profile} className="mt-3"/>
            </View>
          </View>

          <Tabs 
            tabs={tabs} 
            onPressTab={handleTabPress}
            defaultTab={type}
          />
          <View className="">
            <ProfilePosts/>
          </View>
        </ScrollView>
      </View>
    );
  }
  else {
    return (
      <NoResults/>
    );
  }
}
