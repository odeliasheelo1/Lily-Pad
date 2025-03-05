import React, { useState } from 'react';
import { Image, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, runOnJS } from 'react-native-reanimated';

const idleFrame = require('../assets/frog_frame_0.png'); // Idle frog frame
const jumpFrame1 = require('../assets/frog_frame_1.png'); // First jump frame
const jumpFrame2 = require('../assets/frog_frame_2.png'); // Second jump frame

const Frog = ({ lilyPads, floatValue, onLand }) => {
  const [frame, setFrame] = useState(idleFrame); // Track the current frame
  const [position, setPosition] = useState(lilyPads[0]); // Start on the first lily pad
  const [isFlipped, setIsFlipped] = useState(false);
  const [isJumping, setIsJumping] = useState(false); // Track jumping state

  const animatedTop = useSharedValue(position.top + 85); // Center frog vertically
  const animatedLeft = useSharedValue(position.left + 85); // Center frog horizontally

  const jump = () => {
    if (isJumping) return; // Prevent multiple jumps
    setIsJumping(true); // Frog is now jumping
    setFrame(jumpFrame1); // Start jump with Frame 1

    // Filter out the current position to avoid jumping to the same lily pad
    const possiblePads = lilyPads.filter(pad => pad.top !== position.top || pad.left !== position.left);
    if (possiblePads.length === 0) return; // Safety check

    // Pick a new lily pad position
    const newPosition = possiblePads[Math.floor(Math.random() * possiblePads.length)];

    // Calculate the distance between current and target lily pad
    const dx = newPosition.left - position.left;
    const dy = newPosition.top - position.top;
    const distance = Math.sqrt(dx * dx + dy * dy); // Euclidean distance

    // Adjust jump speed based on distance (longer distance = longer duration)
    const baseSpeed = 500; // Minimum jump time for short jumps
    const maxSpeed = 1000; // Maximum jump time for long jumps
    const speed = Math.min(maxSpeed, baseSpeed + distance * 0.5); // Scale duration with distance

    // Determine direction (flip if moving left)
    setIsFlipped(newPosition.left < position.left);

    setPosition(newPosition);

    // Switch to Frame 2 mid-jump for realism
    setTimeout(() => {
      setFrame(jumpFrame2);
    }, speed / 2); // Change frame halfway through the jump

    // Smooth jump transition with distance-based speed
    animatedTop.value = withTiming(newPosition.top + 85, {
      duration: speed,
      easing: Easing.out(Easing.ease),
    }, () => {
      setIsJumping(false); // Frog has landed
      setFrame(idleFrame); // Return to idle frame
      runOnJS(onLand)(newPosition); // Trigger lily pad bounce
    });

    animatedLeft.value = withTiming(newPosition.left + 85, {
      duration: speed,
      easing: Easing.out(Easing.ease),
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    top: animatedTop.value + floatValue.value, // Sync floating motion
    left: animatedLeft.value,
  }));

  return (
    <TouchableWithoutFeedback onPress={jump}>
      <Animated.View style={[styles.frog, animatedStyle]}>
        <Image source={frame} style={[styles.image, isFlipped && styles.flipped]} />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  frog: {
    position: 'absolute',
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  flipped: {
    transform: [{ scaleX: -1 }], // Flip the image horizontally
  },
});

export default Frog;
