import React, { useEffect } from 'react';
import { View } from 'react-native';
import { LilyPadGame } from './LilyPadGame';

// Initialize saved color from localStorage equivalent
const initializeColorPreference = async () => {
  try {
    const value = await AsyncStorage.getItem('frogColor');
    if (value === null) {
      await AsyncStorage.setItem('frogColor', 'green');
    }
  } catch (e) {
    console.error('Failed to load frog color:', e);
  }
};

export default function App() {
  useEffect(() => {
    initializeColorPreference();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <LilyPadGame />
    </View>
  );
}
