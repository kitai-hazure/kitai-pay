import React from 'react';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { ROUTES } from '../constants';
import { QRCodeScreen, Dashboard, CreatePayment } from '../screens';

export type MainNavigatorParamList = {
  [ROUTES.DASHBOARD]: undefined;
  [ROUTES.QRCODESCAN]: undefined;
  [ROUTES.CREATE_PAYMENT]: undefined;
};

const StackNav = createSharedElementStackNavigator<MainNavigatorParamList>();

const MainNavigator = () => {
  return (
    // TODO -> EDIT IT ACCORDINGLY (NAME)
    <StackNav.Navigator
      initialRouteName={ROUTES.DASHBOARD}
      screenOptions={{ headerShown: false }}>
      <StackNav.Screen name={ROUTES.DASHBOARD} component={Dashboard} />
      <StackNav.Screen name={ROUTES.QRCODESCAN} component={QRCodeScreen} />
      <StackNav.Screen name={ROUTES.CREATE_PAYMENT} component={CreatePayment} />
      {/* <StackNav.Screen
        name="TransactionHistory"
        component={TransactionHistory}
      /> */}
    </StackNav.Navigator>
  );
};

export default MainNavigator;
