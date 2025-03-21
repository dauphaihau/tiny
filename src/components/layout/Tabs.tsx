import {
  Animated, Pressable, Text, View, useWindowDimensions, ScrollView
} from 'react-native';
import React from 'react';
import { TAB_HEIGHT } from '@/components/layout/header/constants';
import { useColorScheme } from '@/hooks/useColorScheme';

interface ITab {
  label: string;
  value: string;
}

interface ITabsProps {
  tabs: ITab[];
  onPressTab: (value: string) => void;
  defaultTab?: string;
}

export function Tabs({ tabs, onPressTab, defaultTab }: ITabsProps) {
  const { width } = useWindowDimensions();
  const [currentTab, setCurrentTab] = React.useState(defaultTab ?? tabs[0]?.value);
  const minTabWidth = 100; // minimum width for each tab
  const tabWidth = Math.max(minTabWidth, width / tabs.length);
  const translateX = React.useRef(new Animated.Value(0)).current;
  const { themeColors } = useColorScheme();

  React.useEffect(() => {
    const index = tabs.findIndex(tab => tab.value === currentTab);
    Animated.spring(translateX, {
      toValue: index * tabWidth,
      useNativeDriver: true,
      damping: 15,
      stiffness: 150,
    }).start();
  }, [currentTab, tabWidth, tabs, translateX]);

  const handlePress = (value: string) => {
    setCurrentTab(value);
    onPressTab(value);
  };

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          height: TAB_HEIGHT,
        }}
      >
        <Animated.View
          className="absolute bottom-0 h-1 rounded-lg"
          style={{
            backgroundColor: themeColors.foreground,
            width: tabWidth,
            transform: [{ translateX }],
          }}
        />
        {tabs.map((tab) => (
          <Pressable
            key={tab.value}
            onPress={() => handlePress(tab.value)}
            style={{ width: tabWidth }}
          >
            <View className="px-2 py-3">
              <Text
                adjustsFontSizeToFit
                numberOfLines={1}
                className={`font-bold text-center text-lg  ${
                  currentTab === tab.value ?
                    'text-foreground' :
                    'text-muted-foreground'
                }`}
              >
                {tab.label}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}