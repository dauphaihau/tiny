import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { Text } from '@/components/ui/Text';
import React from 'react';
import { Icon, IconName } from '@/components/common/Icon';

const SIZE_ICON_TOAST = 20;

export const bastToastClasses = {
  text: 'font-medium text-primary-foreground dark:text-foreground',
};

export interface BaseToastProps {
  message: string;
  iconLeading?: {
    name: IconName;
  };
  renderLeading?: () => React.ReactNode;
  renderTrailing?: () => React.ReactNode;
  isLoading?: boolean;
}

export function BaseToast(props: BaseToastProps) {

  const Leading: React.FC = () => {
    if (!props.renderLeading && !props.iconLeading && !props.isLoading) return null;
    return (
      <View>
        {
          props?.isLoading ? (
            <ActivityIndicator style={styles.indicator}/>
          ) : props.renderLeading ? (
            props.renderLeading()
          ) : (
            <Icon 
              name={props.iconLeading!.name} 
              size={SIZE_ICON_TOAST}
              className={bastToastClasses.text}
            />
          )
        }
      </View>
    );
  };

  return (
    <View
      className="bg-primary dark:bg-secondary"
      style={styles.container}
    >
      <View className="flex-row gap-2.5 px-4 py-5">
        <Leading/>
        <Text
          className={bastToastClasses.text}
          style={styles.message}
        >
          {props?.message}
        </Text>
        {props.renderTrailing && props.renderTrailing()}
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