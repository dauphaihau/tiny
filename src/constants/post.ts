import { StyleSheet } from 'react-native';
import { IMAGE_BORDER_RADIUS } from '@/components/common/post/constants';

export const MAX_SIZE_IN_MB = 5;
export const LIMIT_IMAGES_PER_POST = 10;
export const MIN_WIDTH_IMAGE = 320;
export const MAX_WIDTH_IMAGE = 1070;
export const MAX_HEIGHT_IMAGE = 1424;

export const COLORS = {
  borderColor: '#c9cbce',
} as const;

export const postStyles = StyleSheet.create({
  postImage: {
    borderColor: COLORS.borderColor,
    borderRadius: IMAGE_BORDER_RADIUS,
    borderWidth: 0.1,
  },
});
