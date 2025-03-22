import { SafeAreaView } from 'react-native-safe-area-context';
import { NotificationList } from '@/components/app/app/notifications/NotificationList';
import { NotificationType } from '@/types/request/notification/get-notifications';
import { Header } from '@/components/layout/header';
import { useHeaderHeight } from '@/hooks/useHeaderHeight';

const tabs = [
  { label: 'All', value: NotificationType.ALL },
  { label: 'Follows', value: NotificationType.FOLLOWS },
  { label: 'Replies', value: NotificationType.REPLIES },
];

export default function NotificationScreen() {
  const headerHeight = useHeaderHeight(tabs);

  return (
    <SafeAreaView className='flex-1' edges={['left', 'right']}>
      <Header title='Notifications' tabs={tabs} isStatic={false}/>
      <NotificationList headerHeight={headerHeight}/>
    </SafeAreaView>
  );
}