import { useAddress } from '@thirdweb-dev/react-native';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  setAddress,
  setBiometricEnabled,
  setID,
  setIsFirstLaunch,
  setLoggedIn,
  setToken,
} from '../redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE } from '../constants';

const useStart = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [storageHasData, setStorageHasData] = useState(false);
  const address = useAddress();
  const dispatch = useDispatch();

  useEffect(() => {
    if (address !== undefined && storageHasData) {
      dispatch(setLoggedIn(true));
    }
  }, [address, dispatch, storageHasData]);

  useEffect(() => {
    (async () => {
      const [
        [, biometricEnabled],
        [, isFirstLaunch],
        [, userAddress],
        [, userId],
        [, userToken],
      ] = await AsyncStorage.multiGet([
        STORAGE.BIOMETRIC_ENABLED,
        STORAGE.IS_FIRST_LAUNCH,
        STORAGE.USER_ADDRESS,
        STORAGE.USER_ID,
        STORAGE.USER_TOKEN,
      ]);

      if (biometricEnabled === 'false') {
        dispatch(setBiometricEnabled(false));
      }

      if (userAddress !== null && userId !== null && userToken !== null) {
        dispatch(setAddress(userAddress));
        dispatch(setToken(userToken));
        dispatch(setID(userId));
        setStorageHasData(true);
      }

      if (isFirstLaunch === null) {
        await AsyncStorage.setItem(STORAGE.IS_FIRST_LAUNCH, 'false');
        dispatch(setIsFirstLaunch(true));
      }

      setTimeout(() => setShowSplash(false), 1000);
    })();
  }, [dispatch]);

  return { showSplash };
};

export default useStart;
