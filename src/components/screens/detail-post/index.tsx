import { useLocalSearchParams } from 'expo-router';
import { useGetDetailPost } from '@/services/post.service';
import React from 'react';
import { RefreshControl, View } from 'react-native';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { ScrollView } from 'react-native-gesture-handler';
import { NoResults } from '@/components/common/NoResults';
import { ReplyInput } from '@/components/screens/detail-post/ReplyInput';
import { ParentPost } from '@/components/screens/detail-post/ParentPost';
import { Replies } from '@/components/screens/detail-post/Replies';
import { useNavigation } from '@react-navigation/native';
import { BackScreenButton } from '@/components/layout/BackScreenButton';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const sizeIcon = 21;

export function DetailPostScreen() {
  const { id: postId } = useLocalSearchParams<{ id: string }>();
  const {
    post,
    isPending,
    refetch,
  } = useGetDetailPost(Number(postId));
  const navigation = useNavigation();

  const [refreshing, setRefreshing] = React.useState(false);

  React.useEffect(() => {
    navigation.setOptions({
      name: 'posts/[id]',
      headerTitle: 'Post',
      headerShadowVisible: false,
      getId: ({ params }: { params: { id: string } }) => params?.id,
      headerLeft: () => <BackScreenButton/>,
      headerRight: () => (
        <View className="flex-row gap-3">
          <Feather name="bell" size={sizeIcon}/>
          <MaterialCommunityIcons name="dots-horizontal-circle-outline" size={sizeIcon} color="black"/>
        </View>
      ),
    });
  }, [navigation]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  if (isPending) {
    return <LoadingScreen/>;
  }
  else if (post) {
    return (
      <View className="h-full">
        <View className=" pb-16">
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
          >
            <ParentPost post={post}/>
            <Replies/>
          </ScrollView>
        </View>
        <ReplyInput/>
      </View>
    );
  }
  return (
    <NoResults/>
  );
}