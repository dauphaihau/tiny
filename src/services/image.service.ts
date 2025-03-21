import { supabase } from '@/lib/supabase';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import { ImageURISource } from 'react-native';
import { Profile } from '@/types/models/profile';
import { PostImages } from '@/types/models/post';

export const uploadImage = async (folderName: string, fileUri: ImageURISource['uri']) => {
  try {
    const fileName = generateFileName(folderName);

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
  const randomString = Math.random().toString(36).substring(2, 15);
  return `${folderName}/${Date.now()}-${randomString}.png`;
};

const DEFAULT_IMAGE = require('assets/images/image-default.png');
const DEFAULT_AVATAR = require('assets/images/avatar-default.jpg');

export const getStorageUrl = (path: string) =>
  `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/uploads/${path}`;

export const getImage = (path: PostImages['image_path'] | null): ImageURISource => 
  path ? { uri: getStorageUrl(path) } : DEFAULT_IMAGE;

export const getAvatarImage = (path?: Profile['avatar']): ImageURISource => 
  path ? { uri: getStorageUrl(path) } : DEFAULT_AVATAR;
