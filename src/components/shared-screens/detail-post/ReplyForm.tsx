import { View } from 'react-native';
import React from 'react';
import { useCreateReply, useGetDetailPost } from '@/services/post.service';
import { useLocalSearchParams } from 'expo-router';
import { useGetCurrentProfile } from '@/services/profile.service';
import { useGetRepliesPost } from '@/services/post/get-replies-post';
import { QuickResponseForm } from '@/components/common/QuickResponseForm';
import { Avatar } from '@/components/common/Avatar';

type SearchParams = Record<'id', string>;

export function ReplyForm() {
  const { id } = useLocalSearchParams<SearchParams>();
  const { post, refetch: refetchDetailPost } = useGetDetailPost(Number(id));
  const { refetch: refetchReplies } = useGetRepliesPost(Number(id));

  const { data: profile } = useGetCurrentProfile();
  const { isPending, mutateAsync: reply } = useCreateReply();
  
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
      refetchDetailPost();
      refetchReplies();
    }
  };

  return (
    <View className="mx-3 mb-3">
      <QuickResponseForm
        isPending={isPending}
        onSubmit={onSubmit}
        leadingIcon={<Avatar path={profile?.avatar} className="size-[25px]"/>}
        placeholder={post?.profile?.first_name === profile?.first_name ? 'Add to post...' : `Reply to ${post?.profile?.first_name}...`}
      />
    </View>
  );
}