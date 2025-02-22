import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import utc from 'dayjs/plugin/utc';

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.extend(utc);

dayjs.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s',
    s: 'now',
    ss: 'now',
    m: '1m',
    mm: '%dm',
    h: '1h',
    hh: '%dh',
    d: '1d',
    dd: '%dd',
    M: '1m',
    MM: '%dm',
    y: '1y',
    yy: '%dy',
  },
});

export function parsePostCreatedAt(createdAt: string) {
  if (dayjs(createdAt).isValid()) {

    const oneWeekAgo = dayjs.utc().subtract(7, 'day');

    return dayjs.utc(createdAt).isBefore(oneWeekAgo) ?
      dayjs.utc(createdAt).format('D/MM/YYYY') :
      dayjs.utc(createdAt).fromNow();
  }
  return '';
}

export function parseNotificationCreatedAt(createdAt: string) {
  if (dayjs(createdAt).isValid()) {

    const oneWeekAgo = dayjs.utc().subtract(7, 'day');

    return dayjs.utc(createdAt).isBefore(oneWeekAgo) ?
      dayjs.utc(createdAt).format('D/MM/YYYY') :
      dayjs.utc(createdAt).fromNow();
  }
  return '';
}
