import React, { useState } from 'react';
import {
  View, Pressable, PressableProps, ActivityIndicator 
} from 'react-native';
import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { cn } from '@/utils';

const StyledImage = cssInterop(Image, {
  className: 'style',
});

export type CustomImageProps = React.ComponentProps<typeof StyledImage> & {
  fallback?: number;
  onPress?: PressableProps['onPress']
  showActivityIndicator?: boolean
  className?: string
};

export const CustomImage = ({
  source,
  className,
  style,
  contentFit = 'cover',
  fallback,
  onPress,
  showActivityIndicator = true,
  ...props
}: CustomImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const defaultFallback = require('assets/images/image-default.png');
  const fallbackImage = fallback || defaultFallback;

  const imageContent = (
    <>
      {isLoading && (
        <View className="bg-secondary absolute w-full h-full z-10 justify-center">
          {showActivityIndicator && <ActivityIndicator size="small"/>}
        </View>
      )}

      <StyledImage
        source={hasError ? fallbackImage : source}
        className={cn(
          'w-full h-full',
          className
        )}
        contentFit={contentFit}
        transition={300}
        onLoadStart={() => setIsLoading(true)}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        {...props}
      />
    </>
  );

  return (
    <View
      style={{
        ...style,
      }}
      className={cn(
        'overflow-hidden border border-border',
        className
      )}
    >
      {onPress ? (
        <Pressable onPress={onPress}>{imageContent}</Pressable>
      ) : (
        imageContent
      )}
    </View>
  );
};