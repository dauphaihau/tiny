import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Toast from 'react-native-toast-message';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getUsernameFromEmail(email: string) {
  if (!email) return '';   
  return email?.split('@')[0];
}

export const parseSupabaseUrl = (url: string) => {
  let parsedUrl = url;
  if (url.includes('#')) {
    parsedUrl = url.replace('#', '?');
  }
  return parsedUrl;
};

export function truncate(text: string, max: number) {
  if (text?.length > max) {
    return `${text.substring(0, max)}...`;
  }
  return text;
}

export const featureNotAvailable = () => {
  Toast.show({
    type: 'info',
    props: {
      message: 'Feature not available yet',
    },
  });
};
