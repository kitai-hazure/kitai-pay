import { useSelector } from 'react-redux';
import { selectAuthState } from '../redux';
import {
  getInitialRoute,
  navigateWithReset,
  navigateWithResetAndParams,
} from '../helpers';
import { ROUTES } from '../constants';
import { Linking } from 'react-native';
import { useCallback, useEffect, useState } from 'react';

const useSecureRoute = (navigation: any) => {
  const [checkCompleted, setCheckCompleted] = useState(false);
  const authState = useSelector(selectAuthState);
  const route = getInitialRoute(authState);

  const getUrl = useCallback(async () => {
    const url = await Linking.getInitialURL();
    if (url) {
      return url;
    }
  }, []);

  useEffect(() => {
    getUrl().then(url => {
      if (route === ROUTES.ONBOARDING) {
        setTimeout(() => {
          navigateWithReset({ navigation, routeName: ROUTES.ONBOARDING });
        }, 400);
      } else if (route === ROUTES.BIOMETRIC) {
        setTimeout(() => {
          navigateWithResetAndParams({
            navigation,
            routeName: ROUTES.BIOMETRIC,
            params: { url },
          });
        }, 400);
      }
      setTimeout(() => {
        setCheckCompleted(true);
      }, 1000);
    });
  }, [getUrl, navigation, route]);

  return checkCompleted;
};

export default useSecureRoute;
