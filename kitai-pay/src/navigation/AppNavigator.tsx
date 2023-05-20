import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Biometric, NotFound, Onboarding } from '../screens';
import MainNavigator from './MainNavigator';
import { ROUTES } from '../constants';
import { useSelector } from 'react-redux';
import { selectAuthState } from '../redux';
import { getInitialRoute } from '../helpers';

export type AppNavigatorParamList = {
  [ROUTES.ONBOARDING]: undefined;
  [ROUTES.MAIN]: undefined;
  [ROUTES.BIOMETRIC]: { url?: string };
  [ROUTES.NOT_FOUND]: undefined;
};

const StackNav = createStackNavigator<AppNavigatorParamList>();

const AppNavigator = () => {
  const authState = useSelector(selectAuthState);
  const initialRoute = getInitialRoute(authState);
  console.log('initialRoute', initialRoute);

  return (
    <StackNav.Navigator
      initialRouteName={initialRoute}
      screenOptions={{ headerShown: false }}>
      <StackNav.Screen name={ROUTES.ONBOARDING} component={Onboarding} />
      <StackNav.Screen name={ROUTES.MAIN} component={MainNavigator} />
      <StackNav.Screen name={ROUTES.BIOMETRIC} component={Biometric} />
      <StackNav.Screen name={ROUTES.NOT_FOUND} component={NotFound} />
    </StackNav.Navigator>
  );
};

export default AppNavigator;
