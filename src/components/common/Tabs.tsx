import {
  Animated, Pressable, Text, View, useWindowDimensions
} from 'react-native';
import React from 'react';

interface ITab {
  label: string;
  value: string;
}

interface ITabsProps {
  tabs: ITab[];
  onPressTab: (value: string) => void;
  defaultTab?: string;
}

export function Tabs({ tabs, onPressTab, defaultTab = 'default' }: ITabsProps) {
  const [currentTab, setCurrentTab] = React.useState(defaultTab);
  const { width } = useWindowDimensions();
  const tabWidth = width / tabs.length;
  const translateX = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const index = tabs.findIndex(tab => tab.value === currentTab);
    Animated.spring(translateX, {
      toValue: index * tabWidth,
      useNativeDriver: true,
      damping: 15,
      stiffness: 150,
    }).start();
  }, [currentTab, tabWidth, tabs]);

  const handlePress = (value: string) => {
    setCurrentTab(value);
    onPressTab(value);
  };

  return (
    <View className="flex-row border-b border-zinc-200">
      <Animated.View 
        className="absolute bottom-0 h-0.5 bg-black"
        style={{
          width: tabWidth,
          transform: [{ translateX }],
        }}
      />
      {tabs.map((tab) => (
        <Pressable
          key={tab.value}
          onPress={() => handlePress(tab.value)}
          className="flex-1"
        >
          <View className="px-4 py-3">
            <Text
              className={`font-semibold text-center text-base ${
                currentTab === tab.value ?
                  'text-black' :
                  'text-zinc-500'
              }`}
            >
              {tab.label}
            </Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}