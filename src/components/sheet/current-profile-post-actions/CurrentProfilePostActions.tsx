import React from 'react';
import { FlatList, View } from 'react-native';
import { cn } from '@/lib/utils';
import { ButtonSheet } from '../ButtonSheet';
import { DeleteButton } from './DeleteButton';
import { Feather } from '@expo/vector-icons';
import { ActionSheet } from '@/components/sheet/ActionSheet';

type Option = {
  label: string;
  iconName?: keyof typeof Feather.glyphMap;
};

const options: Option[] = [
  { label: 'Save', iconName: 'bookmark' },
  { label: 'Pin to profile' },
  { label: 'Archive', iconName: 'archive' },
  { label: 'Hide like and share counts' },
  { label: 'Who can reply & quote' },
];

export default function CurrentProfilePostActions() {
  return (
    <ActionSheet>
      <View className="gap-4 mt-5 px-4">
        <ButtonSheet
          label="Edit"
          icon={(size) => (
            <Feather name="edit" size={size}/>
          )}
        />
        <FlatList
          data={options}
          keyExtractor={(item) => item.label}
          renderItem={({ item, index }) => (
            <ButtonSheet
              label={item.label}
              icon={(size) => (
                <Feather name={item.iconName} size={size}/>
              )}
              className={
                cn('rounded-none border-t-[0.4px] border-zinc-200',
                  // 'opacity-50',
                  index === 0 && 'rounded-t-2xl',
                  index === options.length - 1 && 'rounded-b-2xl'
                )
              }
            />)}
        />
        <ButtonSheet
          label="Copy link"
          icon={(size) => (
            <Feather name="link" size={size}/>
          )}
        />
        <DeleteButton/>
      </View>
    </ActionSheet>
  );
}
