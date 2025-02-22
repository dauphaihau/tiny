import React from 'react';
import { View, FlatList } from 'react-native';
import { cn } from '@/lib/utils';
import { ButtonSheet } from '@/components/sheet/ButtonSheet';
import { Feather } from '@expo/vector-icons';
import { ActionSheet } from '@/components/sheet/ActionSheet';

const options1 = [
  { label: 'Save' },
  { label: 'Not interested' },
];

const options2 = [
  { label: 'Muted' },
  { label: 'Block' },
  { label: 'Report' },
];

export default function PostActions() {
  return (
    <ActionSheet>
      <View className="gap-4 mt-5 px-4">
        <FlatList
          data={options1}
          keyExtractor={(item) => item.label}
          renderItem={({ item, index }) => (
            <ButtonSheet
              label={item.label}
              className={
                cn('rounded-none border-t-[0.4px] border-zinc-200',
                  index === 0 && 'rounded-t-2xl',
                  index === options1.length - 1 && 'rounded-b-2xl'
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
        <FlatList
          data={options2}
          keyExtractor={(item) => item.label}
          renderItem={({ item, index }) => (
            <ButtonSheet
              label={item.label}
              className={
                cn('rounded-none border-t-[0.4px] border-zinc-200',
                  index === 0 && 'rounded-t-2xl',
                  index === options2.length - 1 && 'rounded-b-2xl'
                )
              }
            />)}
        />
      </View>
    </ActionSheet>
  );
}