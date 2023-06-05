import React from 'react';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { ROUTES } from '../constants';
import {
  QRCodeScreen,
  Dashboard,
  CreatePayment,
  PaymentHistoryScreen,
  MyAssetScreen,
} from '../screens';

export type MainNavigatorParamList = {
  [ROUTES.DASHBOARD]: undefined;
  [ROUTES.QRCODESCAN]: undefined;
  [ROUTES.CREATE_PAYMENT]: undefined;
  [ROUTES.PAYMENT_HISTORY]: undefined;
  [ROUTES.MYASSET_SCREEN]: undefined;
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
      <StackNav.Screen
        name={ROUTES.PAYMENT_HISTORY}
        component={PaymentHistoryScreen}
      />
      <StackNav.Screen name={ROUTES.MYASSET_SCREEN} component={MyAssetScreen} />
      {/* <StackNav.Screen
        name="TransactionHistory"
        component={TransactionHistory}
      /> */}
    </StackNav.Navigator>
  );
};

export default MainNavigator;
