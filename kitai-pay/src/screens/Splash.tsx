import { StyleSheet, View } from 'react-native';
import React from 'react';
import AnimatedLottieView from 'lottie-react-native';
import { COLORS } from '../constants';

const Splash = () => {
  return (
    <View style={styles.container}>
      <AnimatedLottieView
        source={require('../assets/animations/splash.json')}
        autoPlay
        loop
        resizeMode="cover"
        style={styles.animation}
      />
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  animation: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
