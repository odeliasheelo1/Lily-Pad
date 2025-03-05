import React from 'react';
import { View, StyleSheet } from 'react-native';
import Background from '@/components/Background'; 

export default function Index() {
  return (
    <View style={styles.container}>
      <Background />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
