import * as React from 'react';
import {
  Tabs, TabsList, TabsTrigger
} from '@/components/ui/Tabs';
import { Text } from '@/components/ui/Text';
import { router } from 'expo-router';

export function PostTabs() {
  const [value, setValue] = React.useState('default');

  React.useEffect(() => {
    router.setParams({ type: value });
  }, [value]);

  return (
    <Tabs
      value={value}
      onValueChange={setValue}
      className="w-full max-w-[400px] mx-auto flex-col gap-1.5"
    >
      <TabsList className="flex-row w-full">
        <TabsTrigger value="default" className="flex-1">
          <Text>For you</Text>
        </TabsTrigger>
        <TabsTrigger value="following" className="flex-1">
          <Text>Following</Text>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}