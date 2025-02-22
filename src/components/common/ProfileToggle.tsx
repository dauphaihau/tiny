import { Pressable, PressableProps } from 'react-native';
import { Avatar } from '@/components/common/Avatar';
import React from 'react';
import { useGetCurrentProfile } from '@/services/profile.service';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

export const ProfileToggle: React.FC<PressableProps> = (props) => {
  const { data: profile } = useGetCurrentProfile();
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();

  return (
    <Pressable
      {...props}
      onPress={() => navigation.toggleDrawer()}
    >
      <Avatar path={profile?.avatar}/>
    </Pressable>
  );
};