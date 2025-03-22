import * as ImageManipulator from 'expo-image-manipulator';

interface CompressOptions {
  width?: number;
  height?: number;
  quality?: number;
}

export const compressImage = async (uri: string, options?: CompressOptions) => {
  try {
    const actions: ImageManipulator.Action[] = [];
    
    if (options?.width || options?.height) {
      actions.push({
        resize: {
          width: options.width,
          height: options.height,
        },
      });
    }

    return await ImageManipulator.manipulateAsync(
      uri,
      actions,
      {
        compress: options?.quality ?? 1,
        format: uri.toLowerCase().endsWith('.png') ?
          ImageManipulator.SaveFormat.PNG :
          ImageManipulator.SaveFormat.JPEG,
      }
    );
  }
  catch (error) {
    console.error('Error compressing image:', error);
    throw error;
  }
};
