import { supabase } from '@/lib/superbase';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import { ImageURISource } from 'react-native';

export const uploadImage = async (folderName: string, fileUri: ImageURISource['uri']) => {
  try {
    const fileName = generateFileName(folderName);
    console.log('file-name', fileName);

    if (!fileUri) throw new Error('fireUri be undefined');
    const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const fileArrayBuffer = decode(fileBase64);

    const { data, error } = await supabase
      .storage
      .from('uploads')
      .upload(fileName, fileArrayBuffer, {
        cacheControl: '3600',
        upsert: false,
        contentType: 'image/*',
      });
    if (error || !data.path) {
      throw new Error(`errors: [${error?.message}, ${data?.path}]`);
    }
    return data.path;
  }
  catch (error) {
    throw new Error(`error: ${error}`);
  }
};

const generateFileName = (folderName: string) => {
  return `${folderName}/${new Date().getTime()}.png`;
};

export const getAvatarImage = (path?: string): ImageURISource => {
  if (path) {
    return {
      uri: `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/uploads/${path}`,
    };
  }
  return require('assets/images/avatar-default.jpg');
};