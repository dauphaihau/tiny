import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getUsernameFromEmail(email: string) {
  if (!email) return '';   
  return email?.split('@')[0];
}

export function usernameWithPrefix(username?: string | null, prefix = '@') {
  if (!username) return username;
  return `${prefix}${username}`;
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
