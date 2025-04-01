import React from 'react';
import { getImage } from '@/services/image.service';
import { IPost } from '@/types/components/common/post';

import { Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { postStyles } from '@/constants/post';
import { scaleDownPostImage } from '@/utils/scale-down-post-image';
import { DETAIL_POST_CONFIG } from './constantds';
import { CustomImage } from '@/components/common/CustomImage';

const FIXED_HEIGHT = Dimensions.get('window').width * 0.60;

interface PostImagesProps {
  images: IPost['images'];
}

export function PostImages({ images }: PostImagesProps) {
  if (!images || images.length === 0) return null;

  if (images.length === 1) {
    const { width, height } = scaleDownPostImage({
      width: images[0].width!,
      height: images[0].height!,
    });

    return (
      <CustomImage
        source={getImage(images[0].image_path)}
        cachePolicy="memory-disk"
        contentFit="contain"
        style={{
          width,
          height,
          marginLeft: DETAIL_POST_CONFIG.POST_CONTENT_INDENT,
          ...postStyles.postImage,
        }}
      />
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingLeft: DETAIL_POST_CONFIG.POST_CONTENT_INDENT,
        paddingRight: 12,
        gap: 10,
      }}
    >
      {images.map((item, index) => (
        <React.Fragment key={index}>
          <CustomImage
            source={getImage(item.image_path)}
            style={{
              width: ((item.width ?? 1) / (item.height ?? 1)) * FIXED_HEIGHT,
              height: FIXED_HEIGHT,
              ...postStyles.postImage,
            }}
          />
        </React.Fragment>
      ))}
    </ScrollView>
  );
}
