import { Pressable } from 'react-native';
import { Text } from '@/components/ui/Text';
import React from 'react';

const sizeIcon = 18;

type ButtonProps = React.ComponentPropsWithoutRef<typeof Pressable>;

interface LayoutActionButtonProps extends ButtonProps {
  icon: (size: number) => React.ReactNode;
  count?: number;
}

export const LayoutActionButton: React.FC<LayoutActionButtonProps> = ({ count, icon, ...props }) => {
  return (
    <Pressable
      className="flex-row items-center gap-1.5"
      {...props}
    >
      {
        icon && (<Text>{icon(sizeIcon)}</Text>)
      }
      { count ? <Text>{count || ''}</Text> : null }
    </Pressable>
  );
};