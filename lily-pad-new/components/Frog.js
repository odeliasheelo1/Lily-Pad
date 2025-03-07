import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Audio } from 'expo-av';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, runOnJS } from 'react-native-reanimated';

const idleFrame = require('../assets/Frog1.png'); // Idle frog frame
const jumpFrame1 = require('../assets/Frog2.png'); // First jump frame
const jumpFrame2 = require('../assets/Frog3.png'); // Second jump frame

const Frog = ({ lilyPads, floatValue, onLand, volume }) => {
  const [frame, setFrame] = useState(idleFrame); // Track the current frame
  const [position, setPosition] = useState(lilyPads[0]); // Start on the first lily pad
  const [isFlipped, setIsFlipped] = useState(false);
  const [isJumping, setIsJumping] = useState(false); // Track jumping state
  const [jumpSounds, setJumpSounds] = useState([]);
  const [landSound, setLandSound] = useState(null);

  const animatedTop = useSharedValue(position.top + 85); // Center frog vertically
  const animatedLeft = useSharedValue(position.left + 85); // Center frog horizontally

  useEffect(() => {
    const loadSounds = async () => {
      const sound1 = await Audio.Sound.createAsync(require('../assets/jump1.mp3'));
      const sound2 = await Audio.Sound.createAsync(require('../assets/jump2.mp3'));
      const land = await Audio.Sound.createAsync(require('../assets/land.mp3'));
      setJumpSounds([sound1.sound, sound2.sound]);
      setLandSound(land.sound);
    };

    loadSounds();

    return () => {
      jumpSounds.forEach(sound => sound?.unloadAsync());
      landSound?.unloadAsync();
    };
  }, []);

  const playRandomJumpSound = async () => {
    if (jumpSounds.length > 0) {
      const randomSound = jumpSounds[Math.floor(Math.random() * jumpSounds.length)];
      await randomSound.setVolumeAsync(volume);
      await randomSound.replayAsync();
    }
  };

  const playLandSound = async () => {
    if (landSound) {
      await landSound.setVolumeAsync(volume);
      await landSound.replayAsync();
    }
  };

  const jump = async () => {
    if (isJumping) return;
    setIsJumping(true);
    setFrame(jumpFrame1);

    await playRandomJumpSound();

    const possiblePads = lilyPads.filter(pad => pad.top !== position.top || pad.left !== position.left);
    if (possiblePads.length === 0) return;

    const newPosition = possiblePads[Math.floor(Math.random() * possiblePads.length)];

    const dx = newPosition.left - position.left;
    const dy = newPosition.top - position.top;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const speed = Math.min(1000, 500 + distance * 0.5);

    setIsFlipped(newPosition.left < position.left);
    setPosition(newPosition);

    setTimeout(() => setFrame(jumpFrame2), speed / 2);

    animatedTop.value = withTiming(newPosition.top + 85, { duration: speed, easing: Easing.out(Easing.ease) }, async () => {
      setIsJumping(false);
      setFrame(idleFrame);
      await playLandSound();
      runOnJS(onLand)(newPosition);
    });

    animatedLeft.value = withTiming(newPosition.left + 85, { duration: speed, easing: Easing.out(Easing.ease) });
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

// 🔥 **Make sure this styles object is included**
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
