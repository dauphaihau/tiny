import React from 'react';
import { useGetCurrentProfile } from '@/services/profile.service';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Avatar } from '@/components/common/Avatar';
import { headerClassNames } from '@/components/layout/constants';

export const ProfileToggle = () => {
  const { data: profile } = useGetCurrentProfile();
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();

  return (
    <Avatar
      onPress={navigation.toggleDrawer}
      path={profile?.avatar}
      className={headerClassNames.avatar}
    />
  );
};