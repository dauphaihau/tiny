import React from 'react';
import { useToggleLike } from '@/services/post.service';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LayoutActionButton } from '@/components/common/post/LayoutActionButton';
import { PostResponse } from '@/types/request/post';

interface LikeButtonProps {
  postData: PostResponse;
}

export function LikeButton({ postData }: LikeButtonProps) {
  const [isLiked, setIsLiked] = React.useState(postData?.is_liked);
  const [likeCount, setLikeCount] = React.useState(postData?.like_count ?? 0);
  const { mutateAsync: like } = useToggleLike();

  const handleLike = async () => {
    if (!postData?.id) return;
    const { error } = await like(postData?.id);
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
      icon={
        (sizeIcon) => (
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={sizeIcon}
          />
        )
      }
      count={likeCount}
    />
  );
}