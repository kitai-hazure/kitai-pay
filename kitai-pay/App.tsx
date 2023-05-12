import {
  metamaskWallet,
  rainbowWallet,
  trustWallet,
  ThirdwebProvider,
} from '@thirdweb-dev/react-native';
import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppNavigator } from './src/navigation';
import { NavigationContainer } from '@react-navigation/native';
import { useStart } from './src/hooks';

const App = () => {
  const { isLoggedIn } = useStart();

  if (isLoggedIn === null) {
    return <Text>Loading.... </Text>;
  }

  return (
    <ThirdwebProvider
      theme="dark"
      activeChain="polygon"
      supportedWallets={[metamaskWallet(), rainbowWallet(), trustWallet()]}>
      <NavigationContainer>
        <GestureHandlerRootView style={styles.fullScreen}>
          <SafeAreaView style={styles.fullScreen}>
            <AppNavigator isLoggedIn={isLoggedIn} />
          </SafeAreaView>
        </GestureHandlerRootView>
      </NavigationContainer>
    </ThirdwebProvider>
  );
};

const styles = StyleSheet.create({
  fullScreen: { flex: 1 },
});

export default App;
