import React from 'react';
import { cn } from '@/lib/utils';
import { Pressable, Text } from 'react-native';

const sizeIcon = 17;

type ButtonProps = React.ComponentPropsWithoutRef<typeof Pressable> & {
  label: string;
  icon?: (size: number) => React.ReactNode
  textColorClassname?: string;
};

const ButtonSheet = React.forwardRef<React.ElementRef<typeof Pressable>, ButtonProps>(
  ({
    className, textColorClassname, label, ...props
  }, ref) => {
    return (
      <Pressable
        className={cn(
          'bg-white px-4 py-3.5 flex-row justify-between rounded-2xl',
          className
        )}
        ref={ref}
        role="button"
        {...props}
      >
        <Text className={cn('font-semibold', textColorClassname)}>{label}</Text>
        {
          props.icon && (
            <Text className={cn('font-semibold', textColorClassname)}>
              {props.icon(sizeIcon)}
            </Text>
          )
        }
      </Pressable>
    );
  }
);
ButtonSheet.displayName = 'ButtonSheet';

export { ButtonSheet };
export type { ButtonProps };
