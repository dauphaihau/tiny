import React, { useRef, useState, useEffect } from 'react';
import { View, Dimensions, TextInput } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/common/Icon';
import { Input } from '@/components/ui/Input';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate
} from 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';

const ICON_SIZE_INPUT = 24;
const BUTTON_SIZE = 40; // Size of the button (10 units = 40px)
const ANIMATION_DURATION = 250; // Duration in milliseconds

type QuickResponseFormProps = {
  isPending: boolean;
  onSubmit: (content: string) => Promise<void>;
  leadingIcon?: React.ReactNode;
  placeholder?: string;
};

export function QuickResponseForm({
  isPending, onSubmit, leadingIcon, placeholder, 
}: QuickResponseFormProps) {
  const inputRef = useRef<TextInput>(null);
  const [content, setContent] = useState<string>();
  const [isAutoFocus, setIsAutoFocus] = useState(false);
  const screenWidth = Dimensions.get('window').width;
  const { themeColors } = useColorScheme();


  // Use shared values for animations
  const animationProgress = useSharedValue(0);

  // Update animation when content changes
  useEffect(() => {
    animationProgress.value = withTiming(
      content ? 1 : 0,
      {
        duration: ANIMATION_DURATION,
        easing: Easing.bezierFn(0.25, 0.1, 0.25, 1), // Standard easing curve
      }
    );
  }, [content, animationProgress]);

  // Animated styles
  const inputContainerStyle = useAnimatedStyle(() => ({
    flex: 1,
    width: content ? undefined : '100%',
  }));

  const buttonContainerStyle = useAnimatedStyle(() => {
    const translateX = interpolate(animationProgress.value, [0, 1], [screenWidth, 0]);
    const opacity = animationProgress.value;

    return {
      opacity,
      transform: [{ translateX }],
      position: 'absolute',
      right: 0,
      display: content ? 'flex' : 'none',
    };
  });

  const inputPaddingStyle = useAnimatedStyle(() => {
    const rightPadding = interpolate(animationProgress.value, [0, 1], [0, BUTTON_SIZE + 8]);
    return {
      paddingRight: rightPadding,
    };
  });

  const handleInputPress = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSubmit = () => {
    if (content?.trim()) {
      onSubmit(content.trim());
      setContent('');
    }
  };

  return (
    <View className="flex-row items-center relative">
      <Animated.View style={[inputContainerStyle, inputPaddingStyle]}>
        <Input
          onPress={handleInputPress}
          ref={inputRef}
          value={content}
          variant="soft"
          radius="none"
          size="none"
          numberOfLines={4}
          multiline
          onFocus={() => setIsAutoFocus(true)}
          onBlur={() => setIsAutoFocus(false)}
          placeholder={placeholder}
          containerClassName="rounded-[19px] max-h-20 w-full"
          className='py-[14.5px]'
          editable={!isPending}
          onChangeText={(val) => setContent(val)}
          leadingIcon={!isAutoFocus && leadingIcon}
          trailingIcon={
            <View className="flex-row gap-3">
              {!content && <Icon name="photo" onPress={() => {}} size={ICON_SIZE_INPUT}/>}
              {!content && <Icon name="mic" onPress={() => {}} size={ICON_SIZE_INPUT}/>}
              <Icon name="plus.circle" onPress={() => {}} size={ICON_SIZE_INPUT}/>
            </View>
          }
        />
      </Animated.View>

      <Animated.View style={buttonContainerStyle}>
        <Button
          disabled={!content?.trim()}
          onPress={handleSubmit}
          radius="full"
          className="size-10"
          size="none"
        >
          <Icon name="arrow.up" size={19} color={themeColors.primaryForeground} weight='bold'/>
        </Button>
      </Animated.View>
    </View>
  );
} 