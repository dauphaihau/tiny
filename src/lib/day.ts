import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export function parseCreatedAt(created_at: string) {
  if (dayjs(created_at).isValid()) {
    return dayjs(created_at).fromNow();
  }
  return '';
}
