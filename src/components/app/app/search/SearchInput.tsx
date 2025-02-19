import { TextInput, View, type TextInputProps, Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { cn } from '@/lib/utils';

const SearchInput = React.forwardRef<React.ElementRef<typeof TextInput>, TextInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <Pressable
        onPress={props.onPress}
        className="flex-1 bg-zinc-100 rounded-full px-4 py-3.5 flex-row items-center h-full"
      >
        <FontAwesome name="search" size={16} color="gray"/>
        <TextInput
          ref={ref}
          autoCapitalize="none"
          placeholder="Search"
          className={cn(
            'ml-2 flex-1',
            className,
          )}
          placeholderTextColor="gray"
          {...props}
        />
      </Pressable>
    );
  },
);

SearchInput.displayName = 'SearchInput';

export { SearchInput };