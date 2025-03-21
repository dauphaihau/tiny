import React from 'react';
import { getImage } from '@/services/image.service';
import { Image } from 'expo-image';
import { IPost } from '@/types/components/common/post';

import { Dimensions, ScrollViewProps } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { postStyles } from '@/constants/post';
import { POST_CONTENT_INDENT } from '@/components/common/post/constants';
import { scaleDownPostImage } from '@/utils/scale-down-post-image';

const FIXED_HEIGHT = Dimensions.get('window').width * 0.69;

interface PostImagesProps {
  images: IPost['images'];
  contentContainerStyle?: ScrollViewProps['contentContainerStyle']
}

export function PostImageList({ images, contentContainerStyle }: PostImagesProps) {
  if (!images || images.length === 0) return null;

  if (images.length === 1) {
    const { width, height } = scaleDownPostImage({
      width: images[0].width!,
      height: images[0].height!,
    });

    return (
      <Image
        source={getImage(images[0].image_path)}
        cachePolicy="memory-disk"
        style={[
          postStyles.postImage,
          { width, height, marginLeft: POST_CONTENT_INDENT },
        ]}
      />
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        ...(typeof contentContainerStyle === 'object' ? contentContainerStyle : {}),
        paddingLeft: POST_CONTENT_INDENT,
        paddingRight: 16,
        gap: 10,
      }}
    >
      {images.map((item, index) => (
        <React.Fragment key={index}>
          <Image
            source={getImage(item.image_path)}
            style={[
              postStyles.postImage,
              {
                width: ((item.width ?? 1) / (item.height ?? 1)) * FIXED_HEIGHT,
                height: FIXED_HEIGHT,
              },
            ]}
          />
        </React.Fragment>
      ))}
    </ScrollView>
  );
}
