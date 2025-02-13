import { TouchableOpacity } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export const BackScreenButton = () => {
  return (
    <TouchableOpacity onPress={router.back}>
      <Ionicons name="arrow-back-outline" size={21}/>
    </TouchableOpacity>
  );
};
