import { getAvatarImage } from '@/services/image.service';
import { Profile } from '@/types/models/profile';
import { CustomImage, CustomImageProps } from '@/components/common/CustomImage';
import { cn } from '@/utils';
import React, { useMemo } from 'react';

interface Props extends CustomImageProps {
  path?: Profile['avatar']
}

const Avatar = ({
  path,
  className,
  ...props
}: Props) => {
  // Memoize the image source to prevent unnecessary reloads
  const imageSource = useMemo(() => getAvatarImage(path), [path]);
  
  return (
    <CustomImage
      fallback={require('assets/images/avatar-default.jpg')}
      source={imageSource}
      showActivityIndicator={false}
      className={cn(
        'size-10 rounded-full border-0',
        className
      )}
      cachePolicy="memory-disk"
      {...props}
    />
  );
};

// Memoize the entire Avatar component
export const MemoizedAvatar = React.memo(Avatar, (prevProps, nextProps) => {
  // Only re-render if the path or className changes
  return prevProps.path === nextProps.path && prevProps.className === nextProps.className;
});
export { MemoizedAvatar as Avatar };
