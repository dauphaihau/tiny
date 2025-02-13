import * as React from 'react';
import {
  Tabs, TabsList, TabsTrigger
} from '@/components/ui/Tabs';
import { Text } from '@/components/ui/Text';
import { router } from 'expo-router';
import { View, ViewProps } from 'react-native';

export function ProfilePostTabs(props: ViewProps) {
  const [value, setValue] = React.useState('posts');

  React.useEffect(() => {
    router.setParams({ type: value });
  }, [value]);

  return (
    <View {...props}>
      <Tabs
        value={value}
        onValueChange={setValue}
        className="w-full max-w-[400px] mx-auto flex-col gap-1.5"
      >
        <TabsList className="flex-row w-full">
          <TabsTrigger value="posts" className="flex-1">
            <Text>Posts</Text>
          </TabsTrigger>
          <TabsTrigger value="replies" className="flex-1">
            <Text>Replies</Text>
          </TabsTrigger>
        </TabsList>
      </Tabs>

    </View>
  );
}