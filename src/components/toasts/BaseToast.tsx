import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { Text } from '@/components/ui/Text';
import React from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import { NAVIGATION_THEME } from '@/constants/theme';

export interface BaseToastProps {
  message: string;
  renderLeading?: (colors: typeof NAVIGATION_THEME.light) => React.ReactNode;
  renderTrailing?: (colors: typeof NAVIGATION_THEME.light) => React.ReactNode;
  isLoading?: boolean;
}

export function BaseToast(props: BaseToastProps) {
  const { themeColors } = useColorScheme();

  const Leading: React.FC = () => {
    if (!props.renderLeading) return null;
    return (
      <View>
        {
          props?.isLoading ?
            (<ActivityIndicator style={styles.indicator}/>) :
            props.renderLeading(themeColors)
        }
      </View>
    );
  };

  return (
    <View
      className="bg-primary"
      style={styles.container}
    >
      <View className="flex-row gap-2.5 px-4 py-5">
        <Leading/>
        <Text
          className="font-medium text-primary-foreground grow"
          style={styles.message}
        >
          {props?.message}
        </Text>
        {props.renderTrailing && props.renderTrailing(themeColors)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    width: '95%',
  },
  indicator: {
    transform: [{ scaleX: 1 }, { scaleY: 1 }],
  },
  message: {
    flexGrow: 1,
  },
});