import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Audio } from 'expo-av';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';

const idleFrame = require('../assets/Frog1.png'); // Idle frog frame
const jumpStartFrame = require('../assets/Frog2.png'); // Start jump frame
const midAirFrame = require('../assets/Frog3.png'); // Mid-air frame

const FROG_SIZE = 120;
const LILY_PAD_SIZE = 200;

const Frog = ({ lilyPads, floatValue, volume }) => {
  const [frame, setFrame] = useState(idleFrame);
  const [position, setPosition] = useState(lilyPads[0]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [canJump, setCanJump] = useState(true);
  const [jumpSounds, setJumpSounds] = useState([]);

  const animatedTop = useSharedValue(position.top);
  const animatedLeft = useSharedValue(position.left);

  // 🔥 Ensure frog lands centered on lily pad
  const getCenteredPosition = (pad) => ({
    top: pad.top + (LILY_PAD_SIZE / 2) - (FROG_SIZE / 2),
    left: pad.left + (LILY_PAD_SIZE / 2) - (FROG_SIZE / 2),
  });

  useEffect(() => {
    const loadSounds = async () => {
      const sound1 = await Audio.Sound.createAsync(require('../assets/jump1.mp3'));
      const sound2 = await Audio.Sound.createAsync(require('../assets/jump2.mp3'));
      setJumpSounds([sound1.sound, sound2.sound]);
    };

    loadSounds();

    return () => {
      jumpSounds.forEach(sound => sound?.unloadAsync());
    };
  }, []);

  const playRandomJumpSound = async () => {
    if (jumpSounds.length > 0) {
      const randomSound = jumpSounds[Math.floor(Math.random() * jumpSounds.length)];
      await randomSound.setVolumeAsync(volume);
      await randomSound.replayAsync();
    }
  };

  const jump = async () => {
    if (!canJump || isJumping) return; // 🔥 Prevent multiple jumps at once
    setIsJumping(true);
    setCanJump(false); // 🔥 Disable jumping temporarily

    setFrame(jumpStartFrame);
    await playRandomJumpSound(); // 🔥 Play jump sound

    const possiblePads = lilyPads.filter(pad => pad !== position);
    if (possiblePads.length === 0) {
      setIsJumping(false);
      setCanJump(true);
      setFrame(idleFrame);
      return;
    }

    const newPosition = possiblePads[Math.floor(Math.random() * possiblePads.length)];
    const centeredPosition = getCenteredPosition(newPosition);

    const dx = centeredPosition.left - animatedLeft.value;
    const dy = centeredPosition.top - animatedTop.value;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const speed = Math.min(1000, 500 + distance * 0.5);

    setIsFlipped(newPosition.left < position.left);
    
    // 🔥 Smoothly transition through frames during jump
    setTimeout(() => setFrame(midAirFrame), speed / 3); // Mid-air phase
    setTimeout(() => setFrame(jumpStartFrame), (2 * speed) / 3); // Transition back to start frame

    animatedTop.value = withTiming(centeredPosition.top, { duration: speed, easing: Easing.out(Easing.ease) });
    animatedLeft.value = withTiming(centeredPosition.left, { duration: speed, easing: Easing.out(Easing.ease) }, () => {
      setIsJumping(false);
      setFrame(idleFrame);
      setPosition(newPosition);
      setTimeout(() => setCanJump(true), 2000); // 🔥 2-second cooldown
    });
  };

  // 🔥 Sync frog floating with lily pad
  const animatedStyle = useAnimatedStyle(() => ({
    top: animatedTop.value + floatValue.value,
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
    width: FROG_SIZE,
    height: FROG_SIZE,
    resizeMode: 'contain',
  },
  flipped: {
    transform: [{ scaleX: -1 }],
  },
});

export default Frog;
