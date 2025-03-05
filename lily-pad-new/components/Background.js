import React, { useState } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import LilyPad from './LilyPad';
import Frog from './Frog';
import Animated, { useSharedValue, withRepeat, withSequence, withTiming, Easing } from 'react-native-reanimated';

const lilyPadPositions = [
  { top: 650, left: 600 },
  { top: 700, left: 300 },
  { top: 900, left: 500 },
];

const Background = () => {
  // Shared floating animation for all lily pads and frog
  const idleFloat = useSharedValue(0);
  idleFloat.value = withRepeat(
    withSequence(
      withTiming(3, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      withTiming(-3, { duration: 1500, easing: Easing.inOut(Easing.ease) })
    ),
    -1, // Infinite loop
    true
  );

  const [bouncePad, setBouncePad] = useState(null);

  const handleFrogLanding = (newPosition) => {
    setBouncePad(newPosition); // Start bounce immediately
    setTimeout(() => setBouncePad(null), 400); // Reset bounce after animation
  };

  return (
    <ImageBackground source={require('../assets/pond.png')} style={styles.background}>
      {lilyPadPositions.map((pos, index) => (
        <LilyPad key={index} top={pos.top} left={pos.left} floatValue={idleFloat} bounceTrigger={bouncePad?.top === pos.top && bouncePad?.left === pos.left} />
      ))}

      <Frog lilyPads={lilyPadPositions} floatValue={idleFloat} onLand={handleFrogLanding} />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});

export default Background;
