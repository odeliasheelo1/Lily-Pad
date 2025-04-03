import React from 'react';
import { Image, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

const LilyPad = ({ topPct, leftPct, floatValue, pondWidth, pondHeight }) => {
  const size = Math.min(pondWidth, pondHeight) * 0.2;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatValue.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.lilyPad,
        animatedStyle,
        {
          top: pondHeight * topPct,
          left: pondWidth * leftPct,
          width: size,
          height: size,
        },
      ]}
    >
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
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default LilyPad;
