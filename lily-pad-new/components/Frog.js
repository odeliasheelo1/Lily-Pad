import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Audio } from 'expo-av';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';

const idleFrame = require('../assets/Frog1.png');
const jumpStartFrame = require('../assets/Frog2.png');
const midAirFrame = require('../assets/Frog3.png');

const Frog = ({ lilyPads, floatValue, volume, onLand, pondWidth, pondHeight }) => {
  const PAD_SIZE = Math.min(pondWidth, pondHeight) * 0.2;
  const FROG_SIZE = PAD_SIZE * 0.7;

  const [frame, setFrame] = useState(idleFrame);
  const [position, setPosition] = useState(lilyPads[0]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [canJump, setCanJump] = useState(true);
  const [jumpSounds, setJumpSounds] = useState([]);

  const animatedTop = useSharedValue(pondHeight * position.topPct + PAD_SIZE / 2 - FROG_SIZE / 2);
  const animatedLeft = useSharedValue(pondWidth * position.leftPct + PAD_SIZE / 2 - FROG_SIZE / 2);

  // ✅ Recalculate frog position on window/pond resize
  useEffect(() => {
    const newTop = pondHeight * position.topPct + PAD_SIZE / 2 - FROG_SIZE / 2;
    const newLeft = pondWidth * position.leftPct + PAD_SIZE / 2 - FROG_SIZE / 2;

    animatedTop.value = withTiming(newTop, { duration: 200 });
    animatedLeft.value = withTiming(newLeft, { duration: 200 });
  }, [pondWidth, pondHeight, position]);

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
    if (!canJump || isJumping) return;

    setIsJumping(true);
    setCanJump(false);
    setFrame(jumpStartFrame);
    await playRandomJumpSound();

    const options = lilyPads.filter(p => p !== position);
    const next = options[Math.floor(Math.random() * options.length)];

    const targetTop = pondHeight * next.topPct + PAD_SIZE / 2 - FROG_SIZE / 2;
    const targetLeft = pondWidth * next.leftPct + PAD_SIZE / 2 - FROG_SIZE / 2;

    const dx = targetLeft - animatedLeft.value;
    const dy = targetTop - animatedTop.value;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const duration = Math.min(1000, 500 + dist * 0.5);

    setIsFlipped(next.leftPct < position.leftPct);

    setTimeout(() => setFrame(midAirFrame), duration / 3);
    setTimeout(() => setFrame(jumpStartFrame), (2 * duration) / 3);

    animatedTop.value = withTiming(targetTop, { duration, easing: Easing.out(Easing.ease) });
    animatedLeft.value = withTiming(targetLeft, { duration, easing: Easing.out(Easing.ease) }, () => {
      setFrame(idleFrame);
      setPosition(next);
      setIsJumping(false);
      setTimeout(() => setCanJump(true), 1000);
      onLand(next);
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    top: animatedTop.value + floatValue.value,
    left: animatedLeft.value,
    width: FROG_SIZE,
    height: FROG_SIZE,
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
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  flipped: {
    transform: [{ scaleX: -1 }],
  },
});

export default Frog;
