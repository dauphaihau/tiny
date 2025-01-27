import { ImageProps } from 'react-native';
import { cn } from '@/lib/utils';
import { Image } from '@/components/ui/Image';
import { getAvatarImage } from '@/services/image.service';
import { Profile } from '@/types/models/profile';

interface Props extends ImageProps {
  path?: Profile['avatar']
}

export function Avatar(props: Props) {
  return (
    <Image
      {...props}
      fallback={require('assets/images/avatar-default.jpg')}
      source={getAvatarImage(props.path)}
      className={cn('size-8 rounded-full', props.className)}
    />
  );
}