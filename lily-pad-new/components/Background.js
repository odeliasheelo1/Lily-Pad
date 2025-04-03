import React, { useState, useEffect } from 'react';
import { View, ImageBackground, StyleSheet, TouchableOpacity, Text, useWindowDimensions } from 'react-native';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';
import LilyPad from './LilyPad';
import Frog from './Frog';
import Animated, { useSharedValue, withRepeat, withSequence, withTiming, Easing } from 'react-native-reanimated';

const pondBounds = {
  top: 0.33,
  left: 0.08,
  width: 0.85,
  height: 0.5,
};

const lilyPadRelativePositions = [
  { topPct: 0.6, leftPct: 0.3 },
  { topPct: 0.7, leftPct: 0.4 },
  { topPct: 0.8, leftPct: 0.6 },
  { topPct: 0.85, leftPct: 0.25 },
];

const Background = () => {
  const { width, height } = useWindowDimensions();
  const [bouncePad, setBouncePad] = useState(null);
  const [isVolumeOpen, setIsVolumeOpen] = useState(false);
  const [volume, setVolume] = useState(1);
  const [bgMusic, setBgMusic] = useState(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const idleFloat = useSharedValue(0);
  idleFloat.value = withRepeat(
    withSequence(
      withTiming(3, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      withTiming(-3, { duration: 1500, easing: Easing.inOut(Easing.ease) })
    ),
    -1,
    true
  );

  const pondX = width * pondBounds.left;
  const pondY = height * pondBounds.top;
  const pondWidth = width * pondBounds.width;
  const pondHeight = height * pondBounds.height;

  useEffect(() => {
    let music;
    const setupMusic = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });

        music = new Audio.Sound();
        await music.loadAsync(require('../assets/background-music.mp3'));
        await music.setVolumeAsync(volume);
        setBgMusic(music);
      } catch (error) {
        console.error("Error loading background music:", error);
      }
    };

    setupMusic();
    return () => {
      if (music) music.unloadAsync();
    };
  }, []);

  const startMusic = async () => {
    if (bgMusic && !isMusicPlaying) {
      await bgMusic.playAsync();
      await bgMusic.setIsLoopingAsync(true);
      setIsMusicPlaying(true);
    }
  };

  useEffect(() => {
    if (bgMusic) {
      bgMusic.setVolumeAsync(volume);
    }
  }, [volume]);

  const handleFrogLanding = (newPosition) => {
    setBouncePad(newPosition);
    setTimeout(() => setBouncePad(null), 400);
  };

  return (
    <ImageBackground
      source={require('../assets/frogBack.png')}
      style={[styles.background, { width, height }]}
    >
      {/* Top Right Volume Button */}
      <TouchableOpacity
        style={styles.volumeButton}
        onPress={() => {
          setIsVolumeOpen(!isVolumeOpen);
          startMusic();
        }}
      >
        <Text style={styles.volumeText}>{isMusicPlaying ? '🔊' : '🎵'}</Text>
      </TouchableOpacity>

      {/* Volume Slider */}
      {isVolumeOpen && (
        <View style={styles.volumeContainer}>
          <Text style={styles.volumeLabel}>Volume</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1}
            value={volume}
            onValueChange={setVolume}
          />
        </View>
      )}

      {/* Pond Container like a div */}
      <View style={[styles.pondContainer, {
        top: pondY,
        left: pondX,
        width: pondWidth,
        height: pondHeight,
      }]}>
        {/* Lily Pads */}
        {lilyPadRelativePositions.map((pad, index) => (
          <LilyPad
            key={index}
            topPct={pad.topPct}
            leftPct={pad.leftPct}
            floatValue={idleFloat}
            pondWidth={pondWidth}
            pondHeight={pondHeight}
          />
        ))}

        {/* Frog */}
        <Frog
          lilyPads={lilyPadRelativePositions}
          floatValue={idleFloat}
          volume={volume}
          onLand={handleFrogLanding}
          pondWidth={pondWidth}
          pondHeight={pondHeight}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  pondContainer: {
    position: 'absolute',
  },
  volumeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 30,
    padding: 10,
    zIndex: 10,
  },
  volumeText: {
    fontSize: 20,
    color: "white",
  },
  volumeContainer: {
    position: "absolute",
    top: 70,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 10,
    borderRadius: 10,
    zIndex: 10,
  },
  volumeLabel: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  slider: {
    width: 150,
    height: 40,
  },
});

export default Background;
