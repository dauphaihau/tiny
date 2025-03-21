import React from 'react';
import { cn } from '@/utils';
import { Pressable } from 'react-native';
import { Text } from '@/components/ui/Text';
import { useColorScheme } from '@/hooks/useColorScheme';

const ICON_SIZE = 22;

interface ButtonSheetProps extends React.ComponentPropsWithoutRef<typeof Pressable> {
  label: string;
  icon?: (size: number, color: string) => React.ReactNode;
  isDestructive?: boolean;
}

const ButtonSheet = React.forwardRef<React.ElementRef<typeof Pressable>, ButtonSheetProps>(({
  className, label, isDestructive, ...props
}, ref) => {
  const { themeColors } = useColorScheme();
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
          <Text className={cn('font-semibold')}>
            {props.icon(ICON_SIZE, isDestructive ? themeColors.destructive : themeColors.foreground)}
          </Text>
        )
      }
    </Pressable>
  );
});

ButtonSheet.displayName = 'ButtonSheet';

export { ButtonSheet };
export type { ButtonSheetProps };
