import React, { useEffect } from 'react';
import { useToggleLikePost } from '@/services/post.service';
import { ActionIconButton } from '@/components/common/post/ActionIconButton';
import { IPost } from '@/types/components/common/post';
import { supabase } from '@/lib/supabase';
import { useGetCurrentProfile } from '@/services/profile.service';

const colorLiked = '#e9343e';

export function LikePostButton({
  is_liked,
  id: postId,
  likes_count,
}: IPost) {
  const [isLiked, setIsLiked] = React.useState(false);
  const [likesCount, setLikesCount] = React.useState(0);
  const { mutateAsync: toggleLike } = useToggleLikePost();
  const { data: currentProfile } = useGetCurrentProfile();

  useEffect(() => {
    setIsLiked(is_liked);
    setLikesCount(likes_count);
  },[is_liked, likes_count]);

  const handleLike = async () => {
    try {
      // Optimistic update for better UX
      const newIsLiked = !isLiked;
      const newLikesCount = newIsLiked ? likesCount + 1 : likesCount - 1;
      
      // Update UI state immediately
      setIsLiked(newIsLiked);
      setLikesCount(newLikesCount);
      
      // Call API to persist the change
      await toggleLike(postId);
      
      // Broadcast update to other components via Supabase realtime
      await broadcastUpdate(newIsLiked, newLikesCount);
    }
    catch (error) {
      console.error('Error liking post', error);
      // Revert on error
      setIsLiked(isLiked);
      setLikesCount(likes_count);
      broadcastUpdate(isLiked, likes_count);
    }
  };
  
  // Helper function to broadcast updates
  const broadcastUpdate = async (newIsLiked: boolean, newLikesCount: number) => {
    try {
      await supabase.channel(`post-${postId}`).send({
        type: 'broadcast',
        event: 'update_post',
        payload: { 
          likes_count: newLikesCount,
          is_liked: newIsLiked,
          profileIdLiked: currentProfile?.id,
        },
      });
    }
    catch (error) {
      console.error('Error broadcasting update', error);
    }
  };

  return (
    <ActionIconButton
      onPress={handleLike}
      iconName={isLiked ? 'heart.fill' : 'heart'}
      iconClassName={isLiked ? 'text-[#E9343E]' : undefined}
      count={likesCount}
      countColor={isLiked ? colorLiked : undefined}
    />
  );
}