import {
  View, ImageURISource, ScrollView, ScrollViewProps, StyleSheet, Dimensions, Pressable, PressableProps
} from 'react-native';
import React from 'react';
import { Image } from 'expo-image';
import { cn } from '@/utils';
import { scaleDownPostImage } from '@/utils/scale-down-post-image';
import { POST_CONTENT_INDENT } from '@/components/app/modals/new-post/constants';
import { Icon } from '@/components/common/Icon';

const FIXED_HEIGHT = Dimensions.get('window').width * 0.49;

interface ImagePreviewsProps extends ScrollViewProps {
  images: ImageURISource[];
  onRemoveImage: (index: number) => void;
}

export function ImagePreviews({ images, onRemoveImage, ...props }: ImagePreviewsProps) {
  if (!images || images.length === 0) return null;

  if (images.length === 1) {
    const { width, height } = scaleDownPostImage(images[0]);

    return (
      <View
        className="relative"
        style={{
          marginLeft: POST_CONTENT_INDENT,
          marginRight: 19,
          marginTop: 16,
          width,
          height,
        }}
      >
        <Image
          source={images[0]}
          contentFit="contain"
          style={[styles.previewImage, { width: '100%', height: '100%' }]}
        />
        <RemoveButton onPress={() => onRemoveImage(0)} />
      </View>
    );
  }
  else if (images.length > 1) {
    const GAP = 4;
    const totalWidth = images.reduce((acc, item) => {
      return acc + (((item.width ?? 1) / (item.height ?? 1)) * FIXED_HEIGHT);
    }, 0) + POST_CONTENT_INDENT + (GAP * (images.length - 1)); //

    return (
      <ScrollView
        horizontal
        scrollEnabled={totalWidth > Dimensions.get('window').width}
        showsHorizontalScrollIndicator={false}
        className={cn('flex-grow-0 mt-4', props.className)}
        keyboardShouldPersistTaps="always"
        {...props}
      >
        <View className="flex-row gap-4">
          {images.map((item, index) => (
            <View key={index} className="relative">
              <Image
                source={item}
                style={[
                  styles.previewImage,
                  {
                    width: ((item.width ?? 1) / (item.height ?? 1)) * FIXED_HEIGHT,
                    height: FIXED_HEIGHT,
                  },
                ]}
              />
              <RemoveButton onPress={() => onRemoveImage(index)}/>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  previewImage: {
    borderRadius: 10,
  },
});

function RemoveButton({ ...props }: PressableProps) {
  return (
    <Pressable
      className={cn('absolute right-2.5 top-2.5 z-10 bg-black/60 rounded-full p-1.5', props.className)}
      {...props}
    >
      <Icon
        name="close"
        size={16}
        className="text-white"
      />
    </Pressable>
  );
}
