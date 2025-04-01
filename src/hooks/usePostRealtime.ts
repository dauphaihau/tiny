import {
  useEffect, useState, useRef, useCallback 
} from 'react';
import { supabase } from '@/lib/supabase';
import { IPost } from '@/types/components/common/post';
import { useGetCurrentProfile } from '@/services/profile.service';
import { useQueryClient } from '@tanstack/react-query';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useFocusEffect } from '@react-navigation/native';

export function usePostRealtime(post: IPost) {
  const [realtimeStatPost, setRealtimeStatPost] = useState<IPost>(post);
  const { data: currentProfile } = useGetCurrentProfile();
  const queryClient = useQueryClient();
  const channelRef = useRef<RealtimeChannel | null>(null);
  const [focusCounter, setFocusCounter] = useState(0);

  // Track screen focus to force resubscription on navigation return
  useFocusEffect(
    useCallback(() => {
      // Increment counter to trigger resubscription
      setFocusCounter(prev => prev + 1);
      
      // Clean up existing channel
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    }, [channelRef])
  );

  // Update state if props change
  useEffect(() => {
    setRealtimeStatPost(post);
  }, [post]);

  // Setup and cleanup realtime subscription
  useEffect(() => {
    const setupChannel = () => {
      // Clean up any existing channel
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }

      // Create a new channel
      const postChannel = supabase
        .channel(`post-${post.id}`)
        .on(
          'broadcast',
          { event: 'update_post' },
          (payload) => {
            const {
              likes_count, replies_count, is_liked, profileIdLiked, 
            } = payload.payload;
            
            // Update local state  
            setRealtimeStatPost((prevState) => {
              const updatedPost = {
                ...prevState,
                ...(likes_count !== undefined && { 
                  likes_count,
                  is_liked: currentProfile?.id !== profileIdLiked ? prevState.is_liked : is_liked, 
                }),
                ...(replies_count !== undefined && { replies_count }),
              };
              
              return updatedPost;
            });
          }
        )
        .subscribe();

      // Store channel reference
      channelRef.current = postChannel;
    };

    setupChannel();

    // Cleanup function
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [post.id, currentProfile?.id, queryClient, focusCounter]);

  return realtimeStatPost;
} 
