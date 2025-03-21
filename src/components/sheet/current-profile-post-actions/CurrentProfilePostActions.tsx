import React from 'react';
import { View } from 'react-native';
import { featureNotAvailable } from '@/utils';
import { ButtonSheet } from '../ButtonSheet';
import { DeleteButton } from './DeleteButton';
import { ActionSheet } from '@/components/sheet/ActionSheet';
import { Icon } from '@/components/common/Icon';
import { ButtonSheetGroup } from '@/components/sheet/ButtonSheetGroup';
import { ButtonSheetProps } from '@/components/sheet/ButtonSheet';

const options: ButtonSheetProps[] = [
  {
    label: 'Save',
    icon: (size) => <Icon name="bookmark" size={size}/>,
  },
  {
    label: 'Pin to profile',
    icon: (size) => <Icon name="pin" size={size}/>,
  },
  {
    label: 'Archive',
    icon: (size) => <Icon name="archive" size={size}/>,
  },
  {
    label: 'Hide like and share counts',
    icon: (size) => <Icon name="eye.off" size={size}/>,
  },
  {
    label: 'Who can reply & quote',
    icon: (size) => <Icon name="chevron.right" size={size}/>,
  },
];

export default function CurrentProfilePostActions() {
  return (
    <ActionSheet>
      <View className="gap-4 mt-5 px-4">
        <ButtonSheet
          label="Edit"
          onPress={featureNotAvailable}
          icon={(size) => (
            <Icon name="edit" size={size}/>
          )}
        />
        
        <ButtonSheetGroup options={options} />
        
        <ButtonSheet
          label="Copy link"
          onPress={featureNotAvailable}
          icon={(size) => (
            <Icon name="link" size={size}/>
          )}
        />
        <DeleteButton/>
      </View>
    </ActionSheet>
  );
}
