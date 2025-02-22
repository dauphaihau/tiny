import { Dimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Tabs } from '@/components/common/Tabs';
import { router } from 'expo-router';
import { NotificationList } from '@/components/app/app/notifications/NotificationList';
import { TAB_BAR_HEIGHT } from '@/constants/layout';

const tabs = [
  { label: 'All', value: 'all' },
  { label: 'Follows', value: 'follows' },
  { label: 'Replies', value: 'replies' },
];

export default function NotificationScreen() {

  const onPressTab = (value: string) => {
    router.setParams({ type: value });
  };

  const screenHeight = Dimensions.get('window').height;

  return (
    <SafeAreaView className="flex-1">
      <View style={{ height: screenHeight - TAB_BAR_HEIGHT }}>
        <View className="pt-10"/>
        <Tabs
          tabs={tabs}
          onPressTab={onPressTab}
        />
        <NotificationList/>
      </View>
    </SafeAreaView>
  );
}