import React, { useState, useEffect } from 'react';
import { View, ImageBackground, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';
import LilyPad from './LilyPad';
import Frog from './Frog';
import Animated, { useSharedValue, withRepeat, withSequence, withTiming, Easing } from 'react-native-reanimated';

const lilyPadPositions = [
  { top: 650, left: 600 },
  { top: 700, left: 300 },
  { top: 900, left: 500 },
];

const Background = () => {
  const idleFloat = useSharedValue(0);
  idleFloat.value = withRepeat(
    withSequence(
      withTiming(3, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      withTiming(-3, { duration: 1500, easing: Easing.inOut(Easing.ease) })
    ),
    -1,
    true
  );

  const [bouncePad, setBouncePad] = useState(null);
  const [isVolumeOpen, setIsVolumeOpen] = useState(false);
  const [volume, setVolume] = useState(1);
  const [bgMusic, setBgMusic] = useState(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false); // Track if music is playing

  // 🔥 Load Background Music but Do Not Play Immediately
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
      if (music) {
        music.unloadAsync();
      }
    };
  }, []);

  // 🔥 Function to Start Music on User Interaction
  const startMusic = async () => {
    if (bgMusic && !isMusicPlaying) {
      await bgMusic.playAsync();
      await bgMusic.setIsLoopingAsync(true);
      setIsMusicPlaying(true);
    }
  };

  // 🔥 Adjust Background Music Volume in Real-Time
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
    <ImageBackground source={require('../assets/pond.png')} style={styles.background}>
      {/* 🔊 Volume Button (Top Right) */}
      <TouchableOpacity
        style={styles.volumeButton}
        onPress={() => {
          setIsVolumeOpen(!isVolumeOpen);
          startMusic(); // Start music on button click
        }}
      >
        <Text style={styles.volumeText}>{isMusicPlaying ? '🔊' : '🎵'}</Text>
      </TouchableOpacity>

      {/* 🎚️ Volume Slider */}
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

      {/* Lily Pads */}
      {lilyPadPositions.map((pos, index) => (
        <LilyPad key={index} top={pos.top} left={pos.left} floatValue={idleFloat} bounceTrigger={bouncePad?.top === pos.top && bouncePad?.left === pos.left} />
      ))}

      {/* Frog */}
      <Frog lilyPads={lilyPadPositions} floatValue={idleFloat} onLand={handleFrogLanding} volume={volume} />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  volumeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 30,
    padding: 10,
  },
  volumeText: {
    fontSize: 20,
    color: 'white',
  },
  volumeContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 10,
  },
  volumeLabel: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  slider: {
    width: 150,
    height: 40,
  },
});

export default Background;
