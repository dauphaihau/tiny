import {
  FlatList, RefreshControl, View
} from 'react-native';
import { useGetLastMessages } from '@/services/message.service';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import React from 'react';
import { NoResults } from '@/components/common/NoResults';
import { ErrorScreen } from '@/components/common/ErrorScreen';
import { LastMessage } from '@/components/app/app/messages/LastMessage';
import { Separator } from '@/components/common/Separator';

export default function RecentMessagesScreen() {
  const {
    messages,
    isPending,
    refetch,
    isError,
  } = useGetLastMessages();

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  if (isPending) {
    return <LoadingScreen/>;
  }
  if (isError) {
    return <ErrorScreen/>;
  }
  else if (messages.length > 0) {
    return (
      <View className="flex-1">
        <Separator/>
        <View className="px-4 h-full">
          <FlatList
            data={messages}
            renderItem={({ item }) => <LastMessage item={item}/>}
            keyExtractor={(item) => item?.id?.toString()}
            ListHeaderComponent={() => <View className='mt-4'/>}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
          />
        </View>
      </View>
    );
  }
  return <NoResults/>;
}
