import React from 'react';
import { cn } from '@/utils';
import { Pressable } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Icon, IconName } from '@/components/common/Icon';

const ICON_SIZE = 22;

interface ButtonSheetProps extends React.ComponentPropsWithoutRef<typeof Pressable> {
  label: string;
  icon: {
    name: IconName,
  }
  isDestructive?: boolean;
}

const ButtonSheet = React.forwardRef<React.ElementRef<typeof Pressable>, ButtonSheetProps>(({
  className, label, isDestructive, ...props
}, ref) => {
  return (
    <Pressable
      className={cn(
        'bg-actionsheet-card px-4 py-3.5 flex-row justify-between items-center rounded-2xl',
        className
      )}
      ref={ref}
      role="button"
      {...props}
    >
      <Text
        className={cn('font-semibold text-lg',
          isDestructive && 'text-destructive'
        )}
      >{label}</Text>
      {
        props.icon && (
          <Icon name={props?.icon?.name} className={isDestructive ? 'text-destructive' : 'text-foreground'} size={ICON_SIZE} />
        )
      }
    </Pressable>
  );
});

ButtonSheet.displayName = 'ButtonSheet';

export { ButtonSheet };
export type { ButtonSheetProps };
