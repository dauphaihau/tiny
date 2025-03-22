import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Pressable, View, type PressableProps } from 'react-native';
import { cn } from '@/utils';
import { TextClassContext } from '@/components/ui/Text';

const buttonVariants = cva(
  'group flex items-center justify-center',
  {
    variants: {
      variant: {
        none: '',
        filled: 'bg-primary active:opacity-90',
        outline: 'border border-input bg-background active:bg-accent',
        secondary: 'bg-secondary active:opacity-80',
        ghost: 'active:bg-accent',
        link: 'text-primary group-active:underline',
      },
      size: {
        none: '',
        sm: 'h-8 px-3',
        md: 'h-10 px-4',
        lg: 'h-12 px-6',
        xl: 'h-14 px-8',
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
      variant: 'filled',
      size: 'lg',
      radius: 'md',
    },
  }
);

const buttonTextVariants = cva(
  'text-sm native:text-base font-semibold text-foreground',
  {
    variants: {
      variant: {
        none: '',
        filled: 'text-primary-foreground',
        outline: 'group-active:text-accent-foreground',
        secondary: 'text-secondary-foreground group-active:text-secondary-foreground',
        ghost: 'group-active:text-accent-foreground',
        link: 'text-primary group-active:underline',
      },
      size: {
        none: '',
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
        icon: '',
      },
    },
    defaultVariants: {
      variant: 'filled',
      size: 'lg',
    },
  }
);

type ButtonProps = Omit<PressableProps, 'children'> &
  VariantProps<typeof buttonVariants> & {
    leadingIcon?: React.ReactNode;
    trailingIcon?: React.ReactNode;
    children?: React.ReactNode;
  };

const Button = React.forwardRef<React.ElementRef<typeof Pressable>, ButtonProps>(
  ({
    className,
    variant,
    size,
    radius,
    leadingIcon,
    trailingIcon,
    children,
    ...props
  }, ref) => {
    const content = (
      <View className="flex flex-row items-center justify-center gap-1">
        {leadingIcon}
        {children}
        {trailingIcon}
      </View>
    );

    return (
      <TextClassContext.Provider
        value={buttonTextVariants({ variant, size })}
      >
        <Pressable
          className={cn(
            props.disabled && 'opacity-50',
            buttonVariants({
              variant, size, radius, className, 
            })
          )}
          ref={ref}
          role="button"
          {...props}
        >
          {content}
        </Pressable>
      </TextClassContext.Provider>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };
