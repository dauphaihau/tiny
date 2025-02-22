import React from 'react';
import { useToggleLike } from '@/services/post.service';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LayoutActionButton } from '@/components/common/post/LayoutActionButton';
import { IPost } from '@/types/components/common/post';

export function LikePostButton({
  is_liked,
  id: postId,
  likes_count,
}: IPost) {
  const [isLiked, setIsLiked] = React.useState(is_liked);
  const [likeCount, setLikeCount] = React.useState(likes_count ?? 0);
  const { mutateAsync: like } = useToggleLike();

  const handleLike = async () => {
    const { error } = await like(postId);
    if (!error) {
      setIsLiked(!isLiked);
      if (!isLiked) {
        setLikeCount((prevState) => prevState + 1);
      }
      else setLikeCount((prevState) => prevState - 1);
    }
  };

  return (
    <LayoutActionButton
      onPress={handleLike}
      count={likeCount}
      icon={
        (sizeIcon) => (
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={sizeIcon}
          />
        )
      }
    />
  );
}