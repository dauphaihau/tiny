import { View } from 'react-native';
import React from 'react';
import { Label } from '@/components/ui/Label';
import { Text } from '@/components/ui/Text';

interface Props {
  label: string;
  error?: string;
  children: React.ReactNode;
}

export function FormGroup({
  label, error, children,
}: Props) {
  return (
    <View>
      <Label>{label}</Label>
      {children}
      {error && <Text className='text-red-500 mt-2'>{error}</Text>}
    </View>
  );
}
