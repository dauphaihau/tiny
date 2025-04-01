import { View, ViewProps } from 'react-native';
import React from 'react';
import { cn } from '@/utils';
import { Text } from '@/components/ui/Text';

interface FormGroupProps extends ViewProps {
  label: string;
  error?: string;
  children: React.ReactNode;
  classNameLabel?: string;
}

export function FormGroup({
  label, children, className, classNameLabel, ...props
}: FormGroupProps) {
  return (
    <View className={cn('flex-row items-start gap-3 px-4', className)} {...props}>
      <Text className={cn('font-bold text-lg w-24 h-10', classNameLabel)}>{label}</Text>
      <View className="flex-1">
        {children}
      </View>
    </View>
  );
}
