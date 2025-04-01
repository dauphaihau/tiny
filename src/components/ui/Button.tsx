import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Pressable, View, type PressableProps } from 'react-native';
import { cn } from '@/utils';
import { TextClassContext } from '@/components/ui/Text';
import { Icon, type IconProps } from '@/components/common/Icon';

const buttonVariants = cva(
  'group flex items-center justify-center',
  {
    variants: {
      variant: {
        none: '',
        filled: 'bg-primary active:opacity-90',
        outline: 'border border-border bg-background active:bg-accent',
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
  },
);

const buttonIconVariants = cva(
  'group flex items-center justify-center',
  {
    variants: {
      size: {
        none: '',
        sm: 'p-1',
        md: 'p-1.5',
        lg: 'p-2',
        xl: 'p-2.5',
      },
    },
    defaultVariants: {
      size: 'none',
    },
  },
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
      },
    },
    defaultVariants: {
      variant: 'filled',
      size: 'lg',
    },
  },
);

type ButtonProps = Omit<PressableProps, 'children'> &
  VariantProps<typeof buttonVariants> & {
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  icon?: IconProps['name'];
  iconSize?: IconProps['size'];
  iconWeight?: IconProps['weight'];
  children?: React.ReactNode;
  iconClassName?: string;
};

const Button = React.forwardRef<React.ElementRef<typeof Pressable>, ButtonProps>(
  ({
    className,
    iconClassName,
    variant = 'filled',
    size,
    radius,
    leadingIcon,
    trailingIcon,
    icon,
    iconSize,
    iconWeight,
    children,
    ...props
  }, ref) => {
    // Determine the appropriate icon size based on button size
    const getIconSize = () => {
      if (iconSize) return iconSize;

      switch (size) {
        case 'sm':
          return 16;
        case 'md':
          return 20;
        case 'lg':
          return 24;
        case 'xl':
          return 28;
        default:
          return 24;
      }
    };

    // Determine if this is an icon-only button
    const isIconOnly = icon && !children;

    const content = isIconOnly ? (
      <Icon
        name={icon}
        size={getIconSize()}
        weight={iconWeight}
        className={cn(buttonTextVariants({ variant }), iconClassName)}
      />
    ) : (
      <View className="flex flex-row items-center justify-center gap-1">
        {leadingIcon}
        {children}
        {trailingIcon}
      </View>
    );

    const buttonClasses = isIconOnly
      ? cn(
          buttonVariants({ variant, size: 'none', radius }),
          buttonIconVariants({ size }),
          className
        )
      : buttonVariants({ variant, size, radius, className: cn(className) });

    return (
      <TextClassContext.Provider
        value={buttonTextVariants({ variant, size })}
      >
        <Pressable
          className={cn(
            props.disabled && 'opacity-50',
            buttonClasses,
          )}
          ref={ref}
          role="button"
          {...props}
        >
          {content}
        </Pressable>
      </TextClassContext.Provider>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonTextVariants, buttonVariants, buttonIconVariants };
export type { ButtonProps };
