import React from 'react';
import { View } from 'react-native';
import { featureNotAvailable } from '@/utils';
import { ButtonSheet } from '../ButtonSheet';
import { DeleteButton } from './DeleteButton';
import { ActionSheet } from '@/components/sheet/ActionSheet';
import { ButtonSheetGroup } from '@/components/sheet/ButtonSheetGroup';
import { ButtonSheetProps } from '@/components/sheet/ButtonSheet';

const options: ButtonSheetProps[] = [
  {
    label: 'Save',
    icon: { name: 'bookmark' },
  },
  {
    label: 'Pin to profile',
    icon: { name: 'pin' },
  },
  {
    label: 'Archive',
    icon: { name: 'archive' },
  },
  {
    label: 'Hide like and share counts',
    icon: { name: 'eye.off' },
  },
  {
    label: 'Who can reply & quote',
    icon: { name: 'chevron.right' },
  },
];

export default function CurrentProfilePostActions() {
  return (
    <ActionSheet>
      <View className="gap-4 mt-5 px-4">
        <ButtonSheet
          label="Edit"
          onPress={featureNotAvailable}
          icon={{ name: 'edit' }}
        />
        
        <ButtonSheetGroup options={options} />
        
        <ButtonSheet
          label="Copy link"
          onPress={featureNotAvailable}
          icon={{ name: 'link' }}
        />
        <DeleteButton/>
      </View>
    </ActionSheet>
  );
}
