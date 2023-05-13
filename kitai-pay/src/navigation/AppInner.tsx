import { SafeAreaView, StyleSheet, Text } from 'react-native';
import AppNavigator from './AppNavigator';
import React from 'react';
import { useStart } from '../hooks';

const AppInner = () => {
  const { showSplash } = useStart();

  if (showSplash) {
    return <Text>Loading...</Text>;
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
