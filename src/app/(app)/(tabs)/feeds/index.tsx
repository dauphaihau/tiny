import { Text } from '@/components/ui/Text';
import { FlatList, View } from 'react-native';
import { useGetPosts } from '@/services/post.service';
import { PageLoading } from '@/components/ui/PageLoading';
import { Post } from '@/components/common/Post';

export default function FeedsPage() {
  const { data: posts, isPending } = useGetPosts();
  if (isPending) {
    return <PageLoading/>;
  }
  else if (posts) {
    return (
      <View>
        <FlatList
          data={posts}
          renderItem={({ item }) => <Post data={item}/>}
          keyExtractor={(item) => item.id.toString()}
        />
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
