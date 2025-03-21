import React from 'react';
import { View } from 'react-native';
import { cn, featureNotAvailable } from '@/utils';
import { ButtonSheetProps, ButtonSheet } from '@/components/sheet/ButtonSheet';
import { Separator } from '@/components/common/Separator';

interface ButtonSheetGroupProps {
  options: ButtonSheetProps[];
  onPress?: () => void;
}

export const ButtonSheetGroup: React.FC<ButtonSheetGroupProps> = ({ 
  options, 
  onPress = featureNotAvailable, 
}) => {
  return (
    <View>
      {options.map((item, index) => (
        <View key={item.label}>
          <ButtonSheet
            label={item.label}
            onPress={onPress}
            icon={item.icon}
            isDestructive={item.isDestructive}
            className={
              cn('rounded-none',
                index === 0 && 'rounded-t-2xl',
                index === options.length - 1 && 'rounded-b-2xl'
              )
            }
          />
          {
            index !== options.length - 1 && (
              <Separator className='h-[0.5px] bg-actionsheet-border'/>
            )
          }
        </View>
      ))}
    </View>
  );
}; 