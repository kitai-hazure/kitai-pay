import {
  metamaskWallet,
  rainbowWallet,
  trustWallet,
  ThirdwebProvider,
} from '@thirdweb-dev/react-native';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { AppInner } from './src/navigation';
import { StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './src/redux';
import {
  requestUserPermission,
  createNotificationListeners,
  getFCMToken,
} from './src/components/Notification';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const App = () => {
  requestUserPermission();
  createNotificationListeners(() => {
    // console.log('Notification in foreground', remoteMessage);
  });
  getFCMToken();
  // }, []);

  return (
    <Provider store={store}>
      <QueryClientProvider client={new QueryClient()}>
        <ThirdwebProvider
          theme="dark"
          activeChain="polygon"
          supportedWallets={[metamaskWallet(), rainbowWallet(), trustWallet()]}>
          <NavigationContainer>
            <GestureHandlerRootView style={styles.fullScreen}>
              <AppInner />
            </GestureHandlerRootView>
          </NavigationContainer>
        </ThirdwebProvider>
      </QueryClientProvider>
    </Provider>
  );
};

const styles = StyleSheet.create({
  fullScreen: { flex: 1 },
});

export default App;
