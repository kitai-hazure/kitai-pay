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
import { COLORS, ROUTES, STORAGE } from '../constants';
import { AppNavigatorParamList } from '../navigation';
import AnimatedLottieView from 'lottie-react-native';

type BiometricProps = StackNavigationProps<AppNavigatorParamList, 'BIOMETRIC'>;

const Biometric = ({ navigation, route }: BiometricProps) => {
  const url = route.params?.url;
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
      <Text style={styles.title}>Biometric/Password Login</Text>
      <AnimatedLottieView
        source={require('../assets/animations/biometric.json')}
        autoPlay
        loop
        style={styles.lottie}
      />
      <TouchableOpacity onPress={biometricHandler} style={styles.button}>
        <Text style={styles.buttonText}>Biometric Login</Text>
      </TouchableOpacity>
      {isFirstLaunch && (
        <TouchableOpacity onPress={skipBiometrics} style={styles.button}>
          <Text style={styles.buttonText}>Disable Biometrics</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Biometric;

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.LIGHT_GREY,
    borderRadius: 16,
    height: 50,
    marginHorizontal: 60,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.WHITE,
  },
  title: {
    marginTop: 40,
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    marginBottom: 20,
    textAlign: 'center',
  },
  lottie: {
    width: 500,
    height: 500,
    alignSelf: 'center',
  },
});
