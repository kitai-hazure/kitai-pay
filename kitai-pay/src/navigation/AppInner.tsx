import { SafeAreaView, StyleSheet } from 'react-native';
import AppNavigator from './AppNavigator';
import React from 'react';
import { useStart } from '../hooks';
import { Splash } from '../screens';

const AppInner = () => {
  const { showSplash } = useStart();

  if (showSplash) {
    return <Splash />;
  }

  return (
    <SafeAreaView style={styles.fullScreen}>
      <AppNavigator />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  fullScreen: { flex: 1 },
});

export default AppInner;
