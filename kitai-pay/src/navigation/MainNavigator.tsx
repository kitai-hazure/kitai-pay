import { ConnectWallet } from '@thirdweb-dev/react-native';
import React from 'react';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { ROUTES } from '../constants';
import { QRCodeScreen } from '../screens';

const StackNav = createSharedElementStackNavigator();

const Dashboard = () => {
  return <ConnectWallet />;
};

const MainNavigator = () => {
  return (
    // TODO -> EDIT IT ACCORDINGLY (NAME)
    <StackNav.Navigator
      initialRouteName={ROUTES.QRCODESCAN}
      screenOptions={{ headerShown: false }}>
      <StackNav.Screen name={ROUTES.DASHBOARD} component={Dashboard} />
      <StackNav.Screen name={ROUTES.QRCODESCAN} component={QRCodeScreen} />
      {/* <StackNav.Screen
        name="TransactionHistory"
        component={TransactionHistory}
      /> */}
    </StackNav.Navigator>
  );
};

export default MainNavigator;
