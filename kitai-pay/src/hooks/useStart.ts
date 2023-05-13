import { useAddress } from '@thirdweb-dev/react-native';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setBiometricEnabled, setIsFirstLaunch, setLoggedIn } from '../redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE } from '../constants';

const useStart = () => {
  const [showSplash, setShowSplash] = useState(true);
  const address = useAddress();
  const dispatch = useDispatch();

  useEffect(() => {
    if (address !== undefined) {
      dispatch(setLoggedIn(true));
    }
  }, [address, dispatch]);

  useEffect(() => {
    (async () => {
      const [[, biometricEnabled], [, isFirstLaunch]] =
        await AsyncStorage.multiGet([
          STORAGE.BIOMETRIC_ENABLED,
          STORAGE.IS_FIRST_LAUNCH,
        ]);
      if (biometricEnabled === 'false') {
        dispatch(setBiometricEnabled(false));
      }
      if (isFirstLaunch === null) {
        await AsyncStorage.setItem(STORAGE.IS_FIRST_LAUNCH, 'false');
        dispatch(setIsFirstLaunch(true));
      }
    })();
  }, [dispatch]);

  useEffect(() => {
    setTimeout(() => setShowSplash(false), 1000);
  }, []);

  return { showSplash };
};

export default useStart;
