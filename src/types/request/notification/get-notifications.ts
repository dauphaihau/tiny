import { Profile } from '@/types/models/profile';
import { Notification } from '@/types/models/notification';
import { PaginationMetadata } from '@/types/request/common';

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
  total_replies?: number;
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

export interface NotificationResponse {
  notifications: INotification[];
  pagination: PaginationMetadata;
}

export enum NotificationType {
  ALL = 'all',
  FOLLOWS = 'follows',
  REPLIES = 'replies'
}

export interface GetNotificationsParams {
  type?: `${NotificationType}`;
}
