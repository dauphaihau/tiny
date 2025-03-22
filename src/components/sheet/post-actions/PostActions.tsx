import React from 'react';
import { View } from 'react-native';
import { featureNotAvailable } from '@/utils';
import { ButtonSheetProps, ButtonSheet } from '@/components/sheet/ButtonSheet';
import { ActionSheet } from '@/components/sheet/ActionSheet';
import { Icon } from '@/components/common/Icon';
import { ButtonSheetGroup } from '@/components/sheet/ButtonSheetGroup';

const options1: ButtonSheetProps[] = [
  {
    label: 'Save',
    icon: (size) => <Icon name="bookmark" size={size}/>,
  },
  {
    label: 'Not interested',
    icon: (size) => <Icon name="eye.off" size={size}/>,
  },
];

const options2: ButtonSheetProps[] = [
  {
    label: 'Muted',
    icon: (size) => <Icon name="moon" size={size}/>,
  },
  {
    label: 'Block',
    icon: (size, color) => <Icon name="lock" size={size} color={color}/>,
    isDestructive: true,
  },
  {
    label: 'Report',
    icon: (size, color) => <Icon name="report" size={size} color={color}/>,
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
          icon={(size) => (
            <Icon name="link" size={size}/>
          )}
        />

        <ButtonSheetGroup options={options2} />
      </View>
    </ActionSheet>
  );
}