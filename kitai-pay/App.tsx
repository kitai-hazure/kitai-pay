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
import { API, COLORS } from './src/constants';
import { linking } from './src/helpers';

const App = () => {
  requestUserPermission();
  createNotificationListeners(() => {
    // console.log('Notification in foreground', remoteMessage);
  });
  getFCMToken();

  const client = new QueryClient();

  return (
    <Provider store={store}>
      <QueryClientProvider client={client}>
        <ThirdwebProvider
          theme="dark"
          activeChain={'mumbai'}
          supportedWallets={[metamaskWallet(), rainbowWallet(), trustWallet()]}
          authConfig={{
            domain: API.BASE_URL,
            authUrl: API.THIRDWEB_LOGIN,
          }}
          queryClient={client as any}>
          <NavigationContainer
            linking={linking}
            theme={{
              dark: true,
              colors: {
                background: COLORS.BACKGROUND,
                notification: COLORS.BACKGROUND,
                primary: COLORS.BACKGROUND,
                border: COLORS.BACKGROUND,
                card: COLORS.BACKGROUND,
                text: COLORS.WHITE,
              },
            }}>
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
