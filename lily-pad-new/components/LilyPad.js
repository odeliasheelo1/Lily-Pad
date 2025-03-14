import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

const LilyPad = ({ top, left, floatValue }) => {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatValue.value }],
  }));

  return (
    <Animated.View style={[styles.lilyPad, animatedStyle, { top, left }]}>
      <Image source={require('../assets/lily-pad.png')} style={styles.image} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  lilyPad: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});

export default LilyPad;
