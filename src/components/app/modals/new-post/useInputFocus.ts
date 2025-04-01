import { useEffect, useRef } from 'react';
import { TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export function useInputFocus() {
  const inputRef = useRef<TextInput>(null);
  const navigation = useNavigation();

  // Effect to keep the TextInput focused
  useEffect(() => {
    const focusInput = () => {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 500);
    };

    // Focus on mount
    focusInput();

    // Refocus whenever the component gains focus (e.g, after navigating back from camera screen)
    const unsubscribe = navigation.addListener('focus', focusInput);

    // Clean up the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, [navigation]);

  // Helper function to force focus after actions like image picking
  const forceFocus = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return {
    inputRef,
    forceFocus,
  };
} 