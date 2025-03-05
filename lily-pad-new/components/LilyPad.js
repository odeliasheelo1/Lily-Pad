import React, { useEffect } from 'react';
import { Image, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withTiming } from 'react-native-reanimated';

const LilyPad = ({ top, left, floatValue, bounceTrigger }) => {
  const bounceValue = useSharedValue(0); // Bounce effect
  const sinkValue = useSharedValue(0); // Sink effect

  // Trigger bounce and sink animation when the frog lands
  useEffect(() => {
    if (bounceTrigger) {
      // Lily pad sinks slightly when the frog lands
      sinkValue.value = withTiming(3, { duration: 100 });

      // Reduce the bounce intensity and make it blend with floating
      bounceValue.value = withSequence(
        withTiming(-4, { duration: 100 }), // Slight downward movement
        withTiming(3, { duration: 120 }),  // Small bounce upward
        withTiming(-2, { duration: 100 }), // Settle smoothly
        withTiming(0, { duration: 80 })   // Back to normal
      );

      // Reset sink after bounce completes
      setTimeout(() => {
        sinkValue.value = withTiming(0, { duration: 120 });
      }, 400);
    }
  }, [bounceTrigger]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: floatValue.value + sinkValue.value + bounceValue.value }, // Floating + Bounce + Sink
    ],
  }));

  return (
    <Animated.View style={[styles.lilyPad, animatedStyle, { top, left }]}>
      <Image source={require('../assets/lily_pad.png')} style={styles.image} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  lilyPad: {
    position: 'absolute',
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
  },
});

export default LilyPad;
