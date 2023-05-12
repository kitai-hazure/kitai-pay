import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Onboarding, QRCodeScreen } from '../screens';
import MainNavigator from './MainNavigator';
import { ROUTES } from '../constants';

const StackNav = createStackNavigator();

const AppNavigator = () => {
  return (
    <StackNav.Navigator
      initialRouteName={ROUTES.MAIN}
      screenOptions={{ headerShown: false }}>
      <StackNav.Screen name={ROUTES.ONBOARDING} component={Onboarding} />
      <StackNav.Screen name={ROUTES.QRCODESCAN} component={QRCodeScreen} />
      <StackNav.Screen name={ROUTES.MAIN} component={MainNavigator} />
    </StackNav.Navigator>
  );
};

export default AppNavigator;
