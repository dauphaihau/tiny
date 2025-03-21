import BaseActionSheet from 'react-native-actions-sheet';
import React from 'react';
import type { ActionSheetProps } from 'react-native-actions-sheet/dist/src/types';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Separator } from '@/components/common/Separator';

export const ActionSheet: React.FC<ActionSheetProps> = props => {
  const { themeColors } = useColorScheme();

  return (
    <BaseActionSheet
      containerStyle={{
        backgroundColor: themeColors.actionsheet,
        paddingBottom: 40,
        paddingTop: 10,
      }}
      {...props}
    >
      <Separator className="h-1.5 bg-muted-foreground rounded-full w-2/12 mx-auto"/>
      {props.children}
    </BaseActionSheet>
  );
};