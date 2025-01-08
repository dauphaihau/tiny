import { ImageProps, Image as RNImage } from 'react-native';
import React from 'react';

interface Props extends ImageProps {
  fallback?: ImageProps['source'];
}

export function Image(props: Props) {
  const [isError, setIsError] = React.useState(false);
  return (
    <RNImage
      {...props}
      source={isError ? props.fallback : props.source}
      onError={() => setIsError(true)}
    />
  );
}