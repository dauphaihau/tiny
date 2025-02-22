import BaseActionSheet from 'react-native-actions-sheet';
import { View } from 'react-native';
import React from 'react';
import type { ActionSheetProps } from 'react-native-actions-sheet/dist/src/types';

const lightBg = 'hsl(240 5.9% 95%)';

export const ActionSheet: React.FC<ActionSheetProps> = props => {
  return (
    <BaseActionSheet
      containerStyle={{
        backgroundColor: lightBg,
        paddingBottom: 40,
        paddingTop: 10,
      }}
      {...props}
    >
      <View className="border-[2px] border-zinc-500 rounded-full w-2/12 mx-auto"/>
      {props.children}
    </BaseActionSheet>
  );
};