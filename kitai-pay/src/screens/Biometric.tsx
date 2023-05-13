import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useCallback, useEffect } from 'react';
import { loginBiometric, navigateWithReset } from '../helpers';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectAuthState,
  setBiometricEnabled,
  setBiometricLoggedIn,
} from '../redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ROUTES, STORAGE } from '../constants';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppNavigatorParamList } from '../navigation';

interface BiometricProps {
  navigation: StackNavigationProp<AppNavigatorParamList>;
}

const Biometric = ({ navigation }: BiometricProps) => {
  const dispatch = useDispatch();
  const { isFirstLaunch } = useSelector(selectAuthState);

  const biometricHandler = useCallback(async () => {
    const biometricResult = await loginBiometric();
    if (biometricResult) {
      dispatch(setBiometricLoggedIn(true));
      navigateWithReset({ navigation, routeName: ROUTES.MAIN });
    }
  }, [dispatch, navigation]);

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
