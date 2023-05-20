import {
  CommonActions,
  LinkingOptions,
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import { ROUTES } from '../constants';
import { StackNavigationProp } from '@react-navigation/stack';

type NavigationParams<T extends ParamListBase> = {
  navigation: NavigationProp<T>;
  routeName: keyof T;
};

type NavigationParam<T extends ParamListBase> = {
  navigation: NavigationProp<T>;
};

export const navigate = <T extends ParamListBase>({
  navigation,
  routeName,
}: NavigationParams<T>) => {
  navigation.navigate(routeName as any);
};

export const navigateWithReset = <T extends ParamListBase>({
  navigation,
  routeName,
}: NavigationParams<T>) => {
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: routeName as any }],
    }),
  );
};

export const navigateWithResetAndParams = <T extends ParamListBase>({
  navigation,
  routeName,
  params,
}: NavigationParams<T> & { params: any }) => {
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: routeName as any, params }],
    }),
  );
};

export const navigateWithParams = <T extends ParamListBase>({
  navigation,
  routeName,
  params,
}: NavigationParams<T> & { params: any }) => {
  navigation.navigate(routeName as any, params);
};

export const navigateGoBack = <T extends ParamListBase>({
  navigation,
}: NavigationParam<T>) => {
  navigation.goBack();
};

export const linking: LinkingOptions<ReactNavigation.RootParamList> = {
  prefixes: ['kitaipay://', 'https://kitaipay.com'],
  config: {
    screens: {
      [ROUTES.MAIN]: {
        screens: {
          [ROUTES.DASHBOARD]: 'user/dashboard',
          [ROUTES.QRCODESCAN]: 'user/qrcode-scan',
          [ROUTES.CREATE_PAYMENT]: 'user/create-payment/:requestId?',
          [ROUTES.PAYMENT_DETAILS]: 'user/payment-details/:paymentId',
          [ROUTES.PAYMENTS]: 'user/payments',
        },
      },
      [ROUTES.NOT_FOUND]: '*',
    },
  },
};

export interface StackNavigationProps<
  Paramlist extends ParamListBase,
  RouteName extends keyof Paramlist = string,
> {
  navigation: StackNavigationProp<Paramlist, RouteName>;
  route: RouteProp<Paramlist, RouteName>;
}
