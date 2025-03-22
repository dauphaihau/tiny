import { StyleSheet, View } from 'react-native';
import { ImageBackground, ImageBackgroundProps } from 'expo-image';
import { getStorageUrl } from '@/services/image.service';
import React from 'react';
import { DETAIL_PROFILE_CONFIG } from '@/components/shared-screens/detail-profile/constants';

interface Props extends ImageBackgroundProps {
  path?: string
}

export function ProfileBackground(props: Props) {
  const [imageExists, setImageExists] = React.useState(true);

  React.useEffect(() => {
    const checkImageExists = async () => {
      if (props.path) {
        try {
          const response = await fetch(getStorageUrl(props.path));
          if (!response.ok) {
            setImageExists(false);
          }
        }
        catch {
          setImageExists(false);
        }
      }
      else {
        setImageExists(false);
      }
    };
    checkImageExists();
  }, [props.path]);

  if (!imageExists) {
    return <View style={[styles.backgroundImage, styles.fallbackView]} className="bg-zinc-100" />;
  }

  return (
    <ImageBackground
      source={
        props.path ? { uri: getStorageUrl(props.path) } : undefined
      }
      contentFit="cover"
      style={styles.backgroundImage}
      onError={() => setImageExists(false)}
    />
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    height: DETAIL_PROFILE_CONFIG.HEADER_HEIGHT,
    width: '100%',
  },
  fallbackView: {
    height: DETAIL_PROFILE_CONFIG.HEADER_HEIGHT,
  },
});
