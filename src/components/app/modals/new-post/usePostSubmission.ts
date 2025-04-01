import { useState } from 'react';
import { ImageURISource } from 'react-native';
import { router } from 'expo-router';
import { createPost, createPostImages } from '@/services/post.service';
import Toast from 'react-native-toast-message';
import { uploadImage } from '@/services/image.service';
import { compressImage } from '@/utils/compress-image';
import { MAX_WIDTH_IMAGE, MAX_HEIGHT_IMAGE, MAX_SIZE_IN_MB } from '@/constants/post';
import * as FileSystem from 'expo-file-system';
import { supabase } from '@/lib/supabase';

interface UsePostSubmissionProps {
  profileId: string;
  rootNameTab?: string;
}

export function usePostSubmission({ profileId, rootNameTab }: UsePostSubmissionProps) {
  const [isSubmitting, setIsSubmit] = useState(false);

  const handleSubmit = async (content: string, sourceImages?: ImageURISource[]) => {
    if (!profileId) {
      throw new Error('Profile ID cannot be undefined');
    }

    try {
      setIsSubmit(true);
      router.back();

      //  wait modal to close
      setTimeout(() => {
        Toast.show({
          type: 'createPost',
          autoHide: false,
          props: {
            isLoading: true,
            message: 'Posting...',
          },
        });
      }, 100);

      const postCreated = await createPost({
        profile_id: profileId,
        content: content.trim() ?? null,
      });

      // Handle image uploads with compression
      let imagePaths: string[] = [];
      let imageMetadata: { path: string, width?: number, height?: number }[] = [];
      if (sourceImages && sourceImages?.length > 0) {
        const processedImages = sourceImages.map(item => ({
          ...item,
          width: item.width,
          height: item.height,
        }));

        const processedUris = await Promise.all(
          processedImages.map(async (item) => {
            let newWidth = item.width as number;
            let newHeight = item.height as number;
            let newUri = item.uri as string;

            // Limit image size
            const aspectRatio = newWidth / newHeight;

            if (newWidth > MAX_WIDTH_IMAGE) {
              newWidth = MAX_WIDTH_IMAGE;
              newHeight = newWidth / aspectRatio;
            }
            if (newHeight > MAX_HEIGHT_IMAGE) {
              newHeight = MAX_HEIGHT_IMAGE;
              newWidth = newHeight * aspectRatio;
            }
            if (newHeight !== item.height || newWidth !== item.width) {
              const resized = await compressImage(
                item.uri as string,
                {
                  width: newWidth,
                  height: newHeight,
                }
              );
              newUri = resized.uri;
            }

            // Update image width and height
            item.width = Math.round(newWidth);
            item.height = Math.round(newHeight);

            //  Compress image if needed
            let compressQuality = 1;
            let fileSizeInMB = 0;
            const fileInfo = await FileSystem.getInfoAsync(newUri, { size: true });

            if (fileInfo.exists) {
              fileSizeInMB = fileInfo.size / (1024 * 1024);
            }
            while (fileSizeInMB > MAX_SIZE_IN_MB && compressQuality > 0.1) {
              compressQuality -= 0.1; // Reduce quality step by step

              const compressed = await compressImage(
                newUri,
                { quality: compressQuality }
              );

              newUri = compressed.uri;

              const newFileInfo = await FileSystem.getInfoAsync(newUri, { size: true });
              if (newFileInfo.exists) {
                fileSizeInMB = newFileInfo.size / (1024 * 1024);
              }
              else {
                break; // Avoid infinite loop if size is not available
              }
            }

            return newUri;
          })
        );

        if (processedUris.some(uri => uri === undefined)) {
          throw new Error('Error processing images');
        }

        // Then upload processed images
        imagePaths = await Promise.all(
          processedUris.map(uri => uploadImage('posts', uri!))
        );

        // Use processedImages instead of sourceImages for metadata
        imageMetadata = imagePaths.map((path, index) => ({
          path,
          width: processedImages[index].width,
          height: processedImages[index].height,
        }));

        const postImagesBody = imagePaths.map((imagePath, index) => ({
          post_id: postCreated.id,
          image_path: imagePath,
          width: processedImages[index].width,
          height: processedImages[index].height,
        }));
        await createPostImages(postImagesBody);
      }

      const newPost = {
        id: postCreated.id,
        content,
        parent_id: null,
        created_at: postCreated.created_at,
        images: imageMetadata.map(({ path, width, height }) => ({
          image_path: path,
          width,
          height,
        })),
        profile: {
          id: profileId,
          username: null,
          avatar: null,
          first_name: null,
        },
        likes_count: 0,
        replies_count: 0,
        is_liked: false,
      };

      await supabase.channel('posts').send({
        type: 'broadcast',
        event: 'new_post',
        payload: newPost,
      });

      Toast.show({
        type: 'createPost',
        props: {
          isLoading: false,
          message: 'Posted',
          detailPostHref: `/${rootNameTab}/posts/${postCreated.id}`,
        },
      });
    }
    catch (error) {
      console.log('Error create post:', error);
      Toast.show({
        type: 'error',
        props: {
          message: 'Created post failed',
        },
      });
    }
    finally {
      setIsSubmit(false);
    }
  };

  return {
    isSubmitting,
    handleSubmit,
  };
} 