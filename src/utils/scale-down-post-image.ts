import { ImageURISource } from 'react-native';

interface ScaleDownOptions {
  maxWidth?: number;
  maxHeight?: number;
}

export const scaleDownPostImage = (
  image: ImageURISource,
  options: ScaleDownOptions = {}
) => {
  const { maxWidth = 290, maxHeight = 290 } = options;

  const originalWidth = image.width;
  const originalHeight = image.height;

  if (!originalWidth || !originalHeight) {
    // console.warn('Image dimensions not available.  Using default dimensions.');
    return { width: maxWidth, height: maxHeight };
  }

  const aspectRatio = originalWidth / originalHeight;

  let newWidth = originalWidth;
  let newHeight = originalHeight;

  if (newWidth > maxWidth) {
    newWidth = maxWidth;
    newHeight = newWidth / aspectRatio;
  }

  if (newHeight > maxHeight) {
    newHeight = maxHeight;
    newWidth = newHeight * aspectRatio;
  }

  // console.log(`Original dimensions: ${originalWidth}x${originalHeight}`);
  // console.log(`Scaled dimensions: ${newWidth}x${newHeight}`);

  return { width: newWidth, height: newHeight };
};
