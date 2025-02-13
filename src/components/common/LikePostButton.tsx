import React from 'react';
import { useToggleLike } from '@/services/post.service';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LayoutActionButton } from '@/components/common/post/LayoutActionButton';
import { Post } from '@/types/models/post';

interface LikeButtonProps {
  post: {
    id: Post['id'],
    is_liked: boolean
    likes_count: number
  };
}

export function LikePostButton({ post }: LikeButtonProps) {
  const [isLiked, setIsLiked] = React.useState(post?.is_liked);
  const [likeCount, setLikeCount] = React.useState(post?.likes_count ?? 0);
  const { mutateAsync: like } = useToggleLike();

  const handleLike = async () => {
    if (!post?.id) return;
    const { error } = await like(post?.id);
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