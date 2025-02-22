
import { Profile } from '@/types/models/profile';
import { Notification } from '@/types/models/notification';

export interface NotificationActor extends Pick<
  Profile,
  | 'id'
  | 'username' 
  | 'first_name'
  | 'avatar'
> {
  is_following: boolean;
}

export interface NotificationEntityPreview {
  content?: string;
  total_likes?: number;
  total_comments?: number;
  type?: string;
}

export interface NotificationEntity {
  type: string;
  id: number;
  preview: NotificationEntityPreview;
}

export interface INotification extends Pick<
  Notification,
  | 'id'
  | 'created_at'
  | 'entity_id'
  | 'entity_type'
  | 'notification_type'
  | 'profile_id'
  | 'actor_id'
> {
  // Type of notification event
  type: 'follow' | 'new_post' | 'like' | 'reply';
  
  // User who triggered the notification
  actor: NotificationActor;
  
  // Related content entity
  entity: NotificationEntity;
}


export interface PaginationMetadata {
  current_page: number;
  total_pages: number;
  total_items: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface NotificationResponse {
  notifications: INotification[];
  pagination: PaginationMetadata;
}

export interface GetNotificationsParams {
  type?: string;
}
