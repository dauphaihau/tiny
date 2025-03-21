import * as React from 'react';
import {
  TextInput, Pressable, View, PressableProps 
} from 'react-native';
import { cn } from '@/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { useColorScheme } from '@/hooks/useColorScheme';

const inputVariants = cva(
  '',
  {
    variants: {
      variant: {
        none: '',
        outline: 'bg-background border border-input',
        soft: 'bg-input border border-input',
      },
      size: {
        none: '',
        sm: 'h-8 px-1 text-sm leading-[1.5]',
        md: 'h-10 px-1 text-base leading-[1.6]',
        lg: 'h-12 px-1 text-lg leading-[1.7]',
        xl: 'h-14 px-2 text-xl leading-[1.8]',
      },
      radius: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'outline',
      size: 'lg',
      radius: 'lg',
    },
  }
);

export type InputProps = React.ComponentPropsWithoutRef<typeof TextInput> &
  VariantProps<typeof inputVariants> & {
    leadingIcon?: React.ReactNode;
    trailingIcon?: React.ReactNode;
    onPress?: PressableProps['onPress'];
    containerClassName?: string;
  };

const Input = React.forwardRef<React.ElementRef<typeof TextInput>, InputProps>(
  ({
    className,
    placeholderClassName,
    containerClassName,
    variant,
    size,
    radius,
    leadingIcon,
    trailingIcon,
    style,
    onPress,
    ...props
  }, ref) => {
    const { themeColors } = useColorScheme();

    return (
      <Pressable
        onPress={onPress}
        className={cn(
          'flex-row items-center',
          inputVariants({
            variant, size, radius, className: containerClassName,
          }),
          props.editable === false && 'opacity-50'
        )}>
        {leadingIcon && (
          <View className="ml-3 mr-2">
            {leadingIcon}
          </View>
        )}
        <TextInput
          ref={ref}
          autoCapitalize="none"
          selectionColor={themeColors.foreground}
          className={cn(
            'flex-1 text-foreground active:opacity-90 placeholder:text-muted-foreground',
            !leadingIcon && 'pl-3',
            !trailingIcon && 'pr-3',
            className
          )}
          placeholderClassName={cn('text-muted-foreground', placeholderClassName)}
          style={style}
          onPress={onPress}
          {...props}
        />
        {trailingIcon && (
          <View className="ml-2 mr-3">
            {trailingIcon}
          </View>
        )}
      </Pressable>
    );
  }
);

Input.displayName = 'Input';

export { Input };
