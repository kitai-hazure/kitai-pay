import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
} from 'react-native';
import React, { useCallback, useEffect } from 'react';
import {
  StackNavigationProps,
  loginBiometric,
  navigateWithReset,
} from '../helpers';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectAuthState,
  setBiometricEnabled,
  setBiometricLoggedIn,
} from '../redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ROUTES, STORAGE } from '../constants';
import { AppNavigatorParamList } from '../navigation';

type BiometricProps = StackNavigationProps<AppNavigatorParamList, 'BIOMETRIC'>;

const Biometric = ({ navigation, route }: BiometricProps) => {
  const url = route.params.url;
  const dispatch = useDispatch();
  const { isFirstLaunch } = useSelector(selectAuthState);

  const biometricHandler = useCallback(async () => {
    const biometricResult = await loginBiometric();
    if (biometricResult) {
      dispatch(setBiometricLoggedIn(true));
      if (url !== undefined) {
        try {
          await Linking.openURL(url);
        } catch (error) {
          navigateWithReset({ navigation, routeName: ROUTES.MAIN });
        }
      } else {
        navigateWithReset({ navigation, routeName: ROUTES.MAIN });
      }
    }
  }, [dispatch, navigation, url]);

  const skipBiometrics = useCallback(async () => {
    dispatch(setBiometricEnabled(false));
    AsyncStorage.setItem(STORAGE.BIOMETRIC_ENABLED, 'false');
    navigateWithReset({ navigation, routeName: ROUTES.MAIN });
  }, [dispatch, navigation]);

  useEffect(() => {
    biometricHandler();
  }, [biometricHandler]);

  return (
    <View style={styles.fullScreen}>
      {/* TODO: Add some lottie animation here */}
      <Text>Biometric Screen</Text>
      <TouchableOpacity onPress={biometricHandler}>
        <Text>Biometric Login</Text>
      </TouchableOpacity>
      {isFirstLaunch && (
        <TouchableOpacity onPress={skipBiometrics}>
          <Text>Disable Biometrics</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Biometric;

const styles = StyleSheet.create({
  fullScreen: { flex: 1 },
});
