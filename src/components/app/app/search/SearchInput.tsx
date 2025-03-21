import {
  TextInput, type TextInputProps
} from 'react-native';
import React from 'react';
import { Icon } from '@/components/common/Icon';
import { Input } from '@/components/ui/Input';

const SearchInput = React.forwardRef<React.ElementRef<typeof TextInput>, TextInputProps>(
  ({ ...props }, ref) => {
    return (
      <Input
        ref={ref}
        radius="full"
        variant="soft"
        leadingIcon={
          <Icon name="search" size={16} color="gray" weight="bold"/>
        }
        placeholder="Search"
        {...props}
      />
    );
  }
);

SearchInput.displayName = 'SearchInput';

export { SearchInput };