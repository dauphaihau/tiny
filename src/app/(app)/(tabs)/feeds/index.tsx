import { Text } from '@/components/ui/Text';
import {
  FlatList, RefreshControl, ScrollView, View 
} from 'react-native';
import { useGetPosts } from '@/services/post.service';
import { PageLoading } from '@/components/ui/PageLoading';
import React from 'react';
import { Post } from '@/components/common/Post';

export default function FeedsPage() {
  const { data: posts, isPending, refetch } = useGetPosts();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);
  
  if (isPending) {
    return <PageLoading/>;
  }
  else if (posts) {
    return (
      <View>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
          }
        >
          <FlatList
            scrollEnabled={false}
            data={posts}
            renderItem={({ item }) => <Post data={item}/>}
            keyExtractor={(item) => item.id.toString()}
          />
        </ScrollView>
      </View>
    );
  }
  else {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Empty</Text>;
      </View>
    );
  }
};
