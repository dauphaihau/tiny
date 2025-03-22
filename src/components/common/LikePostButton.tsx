import React, { useEffect } from 'react';
import { useToggleLikePost } from '@/services/post.service';
import { ActionIconButton } from '@/components/common/post/ActionIconButton';
import { IPost } from '@/types/components/common/post';
import { supabase } from '@/lib/supabase';

export function LikePostButton({
  is_liked,
  id: postId,
  likes_count,
}: IPost) {
  const [isLiked, setIsLiked] = React.useState(is_liked);
  const [likesCount, setLikesCount] = React.useState(0);
  const { mutateAsync: like } = useToggleLikePost();

  useEffect(() => {
    setLikesCount(likes_count);
  },[likes_count]);

  const handleLike = async () => {
    const { error } = await like(postId);
    if (!error) {
      const newIsLiked = !isLiked;
      setIsLiked(newIsLiked);
      const newLikesCount = newIsLiked ?
        likesCount + 1 :
        likesCount - 1;
      setLikesCount(newLikesCount);
      
      await supabase.channel('posts').send({
        type: 'broadcast',
        event: 'like_post',
        payload: { 
          post_id: postId,
          likes_count: newLikesCount,
        },
      });
    }
  };

  return (
    <ActionIconButton
      onPress={handleLike}
      count={likesCount}
      iconName={isLiked ? 'heart.fill' : 'heart'}
    />
  );
}