import { ConnectWallet } from '@thirdweb-dev/react-native';
import React from 'react';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { ROUTES } from '../constants';

const StackNav = createSharedElementStackNavigator();

const Dashboard = () => {
  return <ConnectWallet />;
};

const MainNavigator = () => {
  return (
    <StackNav.Navigator
      initialRouteName={ROUTES.DASHBOARD}
      screenOptions={{ headerShown: false }}>
      <StackNav.Screen name={ROUTES.DASHBOARD} component={Dashboard} />
      {/* <StackNav.Screen
        name="TransactionHistory"
        component={TransactionHistory}
      /> */}
    </StackNav.Navigator>
  );
};

export default MainNavigator;
