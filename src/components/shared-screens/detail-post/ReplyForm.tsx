import { View } from 'react-native';
import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { useCreateReply } from '@/services/post.service';
import { useGetCurrentProfile } from '@/services/profile.service';
import { useGetRepliesPost } from '@/services/post/get-replies-post';
import { QuickResponseForm } from '@/components/common/QuickResponseForm';
import { supabase } from '@/lib/supabase';
import { IPost } from '@/types/components/common/post';
import { TextInput } from 'react-native';
import { Avatar } from '@/components/common/Avatar';

export type ReplyFormRef = {
  focusInput: () => void;
};

type ReplyFormProps = {
  post: IPost;
};

export const ReplyForm = forwardRef<ReplyFormRef, ReplyFormProps>(({ post }, ref) => {
  const { refetch: refetchReplies } = useGetRepliesPost(Number(post.id));
  const inputRef = useRef<TextInput>(null);
  const { data: profile } = useGetCurrentProfile();
  const { isPending, mutateAsync: reply } = useCreateReply();
  
  useImperativeHandle(ref, () => ({
    focusInput: () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    },
  }));

  const onSubmit = async (content: string) => {
    if (!post || !profile || !content) {
      return;
    }
    const { error } = await reply({
      parent_id: post.id,
      profile_id: profile.id,
      content,
    });
    if (!error) {

      await supabase.channel(`post-${post.id}`).send({
        type: 'broadcast',
        event: 'update_post',
        payload: { 
          replies_count: (post.replies_count || 0) + 1,
        },
      });

      refetchReplies();
    }
  };

  return (
    <View className="mx-3 mb-3">
      <QuickResponseForm
        ref={inputRef}
        isPending={isPending}
        onSubmit={onSubmit}
        leadingIcon={<Avatar path={profile?.avatar} className="size-[28px]" />}
        placeholder={post?.profile?.first_name === profile?.first_name ? 'Add to post...' : `Reply to ${post?.profile?.first_name}...`}
      />
    </View>
  );
});