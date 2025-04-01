import React from 'react';
import { View } from 'react-native';
import { featureNotAvailable } from '@/utils';
import { ButtonSheetProps, ButtonSheet } from '@/components/sheet/ButtonSheet';
import { ActionSheet } from '@/components/sheet/ActionSheet';
import { ButtonSheetGroup } from '@/components/sheet/ButtonSheetGroup';

const options1: ButtonSheetProps[] = [
  {
    label: 'Save',
    icon: { name: 'bookmark' },
  },
  {
    label: 'Not interested',
    icon: { name: 'eye.off' },
  },
];

const options2: ButtonSheetProps[] = [
  {
    label: 'Muted',
    icon: { name: 'moon' },
  },
  {
    label: 'Block',
    icon: { name: 'lock' },
    isDestructive: true,
  },
  {
    label: 'Report',
    icon: { name: 'report' },
    isDestructive: true,
  },
];

export default function PostActions() {
  return (
    <ActionSheet>
      <View className="gap-4 mt-5 px-4">
        <ButtonSheetGroup options={options1} />

        <ButtonSheet
          onPress={featureNotAvailable}
          label="Copy link"
          icon={{ name: 'link' }}
        />

        <ButtonSheetGroup options={options2} />
      </View>
    </ActionSheet>
  );
}