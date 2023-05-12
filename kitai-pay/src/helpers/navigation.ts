import {
  CommonActions,
  NavigationProp,
  ParamListBase,
} from '@react-navigation/native';

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
