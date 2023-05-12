import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Onboarding, QRCodeScreen } from '../screens';
import MainNavigator from './MainNavigator';
import { ROUTES } from '../constants';

export type AppNavigatorParamList = {
  [ROUTES.ONBOARDING]: undefined;
  [ROUTES.MAIN]: undefined;
  [ROUTES.QRCODESCAN]: undefined;
};

const StackNav = createStackNavigator<AppNavigatorParamList>();

interface AppNavigatorProps {
  isLoggedIn: boolean;
}

const AppNavigator = ({ isLoggedIn }: AppNavigatorProps) => {
  return (
    <StackNav.Navigator
      initialRouteName={isLoggedIn ? ROUTES.MAIN : ROUTES.ONBOARDING}
      screenOptions={{ headerShown: false }}>
      <StackNav.Screen name={ROUTES.ONBOARDING} component={Onboarding} />
      <StackNav.Screen name={ROUTES.QRCODESCAN} component={QRCodeScreen} />
      <StackNav.Screen name={ROUTES.MAIN} component={MainNavigator} />
    </StackNav.Navigator>
  );
};

export default AppNavigator;
