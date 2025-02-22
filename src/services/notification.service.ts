import { supabase } from '@/lib/supabase';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useGetCurrentProfile } from '@/services/profile.service';
import { GetNotificationsParams, NotificationResponse } from '@/types/request/notification/get-notifications';

export const useGetNotifications = (params?: GetNotificationsParams) => {
  const { data: currentProfile } = useGetCurrentProfile();
  const PAGE_SIZE = 20;

  const query = useInfiniteQuery({
    enabled: !!currentProfile?.id,
    queryKey: ['notifications', currentProfile?.id, params?.type],
    queryFn: async ({ pageParam = 1 }) => {
      const { data, error } = await supabase.rpc('get_notifications', {
        target_profile_id: currentProfile!.id,
        page_number: pageParam,
        items_per_page: PAGE_SIZE,
        filter_type: params?.type || 'all',
      });

      if (error) {
        throw error;
      }

      // Type assertion for the entire response
      const response = data[0] as unknown as NotificationResponse;
      
      return {
        notifications: response.notifications,
        pagination: response.pagination,
      };
    },
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.pagination;
      return pagination.has_next ? pagination.current_page + 1 : undefined;
    },
    initialPageParam: 1,
  });

  return {
    ...query,
    notifications: query.data?.pages.flatMap(page => page.notifications) ?? [],
  };
};