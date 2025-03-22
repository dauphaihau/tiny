// import {
//   View, ScrollViewProps
// } from 'react-native';
// import React from 'react';
// import { Image } from 'expo-image';
// import { StyleSheet } from 'react-native';
// import { getImage } from '@/services/image.service';
// import { PostImages as IPostImages } from '@/types/models/post';
// import { ScrollView } from 'react-native-gesture-handler';
//
// const MIN_IMAGES = 2;
// const blurHash =
//   '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';
//
// interface PostImagesProps extends ScrollViewProps {
//   images: Pick<IPostImages, 'image_path'>[];
// }
// export function PostImages({ images, ...props }: PostImagesProps) {
//   if (!images || images.length < MIN_IMAGES) return null;
//
//   return (
//     <ScrollView
//       horizontal
//       scrollEventThrottle={16}
//       showsHorizontalScrollIndicator={false}
//       className="flex-grow-0"
//       {...props}
//     >
//       <View className="flex-row gap-3">
//         {
//           images.map((item, index) => (
//             <Image
//               key={`${item.image_path}-${index}`}
//               source={getImage(item.image_path)}
//               style={styles.image}
//               cachePolicy="memory-disk"
//               contentFit="cover"
//               transition={200}
//               placeholder={blurHash}
//             />
//           ))
//         }
//       </View>
//     </ScrollView>
//   );
// }
//
// const styles = StyleSheet.create({
//   image: {
//     borderRadius: 12,
//     height: 288,
//     width: 288,
//   },
// });


import React from 'react';
import { getImage } from '@/services/image.service';
import { Image } from 'expo-image';
import { IPost } from '@/types/components/common/post';

import { Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { postStyles } from '@/constants/post';
import { scaleDownPostImage } from '@/utils/scale-down-post-image';
import { DETAIL_POST_CONFIG } from './constantds';

const FIXED_HEIGHT = Dimensions.get('window').width * 0.69;

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
      <Image
        source={getImage(images[0].image_path)}
        cachePolicy="memory-disk"
        contentFit='contain'
        style={[
          postStyles.postImage,
          { width, height, marginLeft: DETAIL_POST_CONFIG.POST_CONTENT_INDENT },
        ]}
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
